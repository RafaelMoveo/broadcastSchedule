
import { Router } from 'express';
import ShowController from '../controllers/showController';
const showsRoutes = Router();

//Get show by id
showsRoutes.get('/:showId', ShowController.getShowById );

//Filter shows 
showsRoutes.post('/filtered', ShowController.filteredShows );

//Create new show
showsRoutes.post('/', ShowController.createNewShow );

//Update existing show
showsRoutes.put('/', ShowController.updateShow );

export { showsRoutes };