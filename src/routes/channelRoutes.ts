import { Router } from 'express';
import ChannelController from '../controllers/channelController';
const channelRoutes = Router();

//Filter shows 
channelRoutes.post('/', ChannelController.getChannelShows );

export { channelRoutes };