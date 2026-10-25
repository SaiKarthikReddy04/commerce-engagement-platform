import {
    addItemToCart,
    clearUserCart,
    getUserCart,
    removeItemFromCart,
    updateCartItemQuantity,
  } from "./cart.service.js";
  
  export async function getCart(req, res, next) {
    try {
      const cart = await getUserCart(req.user.id);
      res.status(200).json({ data: cart });
    } catch (error) {
      next(error);
    }
  }
  
  export async function addCartItem(req, res, next) {
    try {
      const cart = await addItemToCart(req.user.id, req.body);
      res.status(200).json({ data: cart });
    } catch (error) {
      next(error);
    }
  }
  
  export async function updateCartItem(req, res, next) {
    try {
      const cart = await updateCartItemQuantity(
        req.user.id,
        req.params.productId,
        req.body.quantity,
      );
      res.status(200).json({ data: cart });
    } catch (error) {
      next(error);
    }
  }
  
  export async function removeCartItem(req, res, next) {
    try {
      const cart = await removeItemFromCart(
        req.user.id,
        req.params.productId,
      );
      res.status(200).json({ data: cart });
    } catch (error) {
      next(error);
    }
  }
  
  export async function clearCart(req, res, next) {
    try {
      const cart = await clearUserCart(req.user.id);
      res.status(200).json({ data: cart });
    } catch (error) {
      next(error);
    }
  }