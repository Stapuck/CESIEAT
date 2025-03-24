import { Hono } from 'hono';
import { getTasks, getTask, createTask, editTask, deleteTask, getCompletedTasks, getTasksByTitle} from '../controllers/taskController.js';

// revoçir l'import de middleware requirefield


const taskRoute = new Hono();



taskRoute.get('/', getTasks);
taskRoute.get('/:id', getTask);
taskRoute.post('/', createTask);
// taskRoute.put('/:id', editTask, requiredFields(["name", "price"]));
taskRoute.put('/:id', editTask);
taskRoute.delete('/:id', deleteTask);


//custom 

taskRoute.get('/title/:title', getTasksByTitle);
taskRoute.get('/status/completed', getCompletedTasks);

export default taskRoute;