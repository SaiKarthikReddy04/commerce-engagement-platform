import * as productService from "./product.service.js";

export async function listProducts(req, res, next) {
  try {
    const result = await productService.listProducts(req.query);

    res.status(200).json({
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAdminProducts(req, res, next) {
  try {
    const result = await productService.listProducts(req.query, {
      admin: true,
    });

    res.status(200).json({
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.productId);

    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body ?? {});

    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProductById(req, res, next) {
  try {
    const product = await productService.updateProductById(
      req.params.productId,
      req.body ?? {},
    );

    res.status(200).json({ data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductById(req, res, next) {
  try {
    await productService.deleteProductById(req.params.productId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listProductCategories(req, res, next) {
  try {
    const categories = await productService.listProductCategories();
    res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
}
