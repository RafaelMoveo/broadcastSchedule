
import { Router } from 'express';
import ShowController from '../controllers/showController';
const showsRoutes = Router();

//Get show by id
showsRoutes.get('/:showId', ShowController.getShowById );

//Filter shows 
showsRoutes.post('/', ShowController.filteredShows );

//Create new show
showsRoutes.post('/create', ShowController.createNewShow );

//Update existing show
showsRoutes.post('/update', ShowController.updateShow );

export { showsRoutes };