import { useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useAddCartItemMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../api/cartApi.js";

function getErrorMessage(error) {
  return (
    error?.data?.error?.message ||
    error?.data?.message ||
    error?.error ||
    "The cart request failed."
  );
}

async function unwrapRequest(request) {
  try {
    return await request.unwrap();
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export function useCart() {
  const isAuthenticated = useSelector((state) =>
    Boolean(state.auth.user && state.auth.accessToken),
  );

  const {
    data: cart = null,
    isLoading,
    isFetching,
    error: queryError,
    refetch,
  } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [addCartItem] = useAddCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const addItem = useCallback(
    (productId, quantity = 1) =>
      unwrapRequest(addCartItem({ productId, quantity })),
    [addCartItem],
  );

  const updateItem = useCallback(
    (productId, quantity) =>
      unwrapRequest(updateCartItem({ productId, quantity })),
    [updateCartItem],
  );

  const removeItem = useCallback(
    (productId) => unwrapRequest(removeCartItem(productId)),
    [removeCartItem],
  );

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return null;

    const result = await refetch();

    if (result.error) {
      throw new Error(getErrorMessage(result.error));
    }

    return result.data;
  }, [isAuthenticated, refetch]);

  const itemCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return {
    cart,
    itemCount,
    isLoading: isLoading || isFetching,
    error: queryError ? getErrorMessage(queryError) : "",
    refreshCart,
    addItem,
    updateItem,
    removeItem,
  };
}
