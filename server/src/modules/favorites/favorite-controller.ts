import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import FavoriteService from './favorite-service';

const FavoriteController = {
  addFavoriteItem: async (req: Request, res: Response) => {
    const favoriteData = req.body;
    const favorite = await FavoriteService.addFavoriteItem(favoriteData);
    return res
      .status(201)
      .json(ApiResponse.success('Favorite item added successfully', favorite));
  },

  listByUser: async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ...filterParams
    } = req.query;
    const userId = req.params.userId;
    const favorite = await FavoriteService.listByUser(userId, {
      page: Number(page),
      limit: Number(limit),
      filterParams: filterParams,
      sortBy: sortBy as string,
      sortOrder: sortOrder as string
    });
    return res
      .status(200)
      .json(
        ApiResponse.success('Favorite items retrieved successfully', favorite)
      );
  },

  remove: async (req: Request, res: Response) => {
    const favoriteId = req.params.favoriteId;
    await FavoriteService.remove(favoriteId);
    return res
      .status(200)
      .json(ApiResponse.success('Favorite item removed successfully'));
  }
};

export default FavoriteController;
