import { Request, Response } from 'express';

import ApiResponse from '~/types/api-response';

import FavoriteService from './favorite-service';

const FavoriteController = {
  addFavoriteItem: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const favoriteData = req.body;
    const favorite = await FavoriteService.addFavoriteItem(
      userId,
      favoriteData
    );
    return res
      .status(201)
      .json(ApiResponse.success('Favorite item added successfully', favorite));
  },

  listByUser: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const favorite = await FavoriteService.listByUser(userId);
    return res
      .status(200)
      .json(
        ApiResponse.success('Favorite items retrieved successfully', favorite)
      );
  },

  removeFavoriteItem: async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const favoriteData = req.body;
    const favorite = await FavoriteService.removeFavoriteItem(
      userId,
      favoriteData
    );
    return res
      .status(200)
      .json(
        ApiResponse.success('Favorite item removed successfully', favorite)
      );
  }
};

export default FavoriteController;
