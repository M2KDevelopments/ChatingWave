const router = require('express').Router();
const Controller = require('../controllers/openai');
const { auth } = require('../middlewares/authorization');


// GETS
router.get('/models', auth, Controller.getModels);
router.get('/assistants', auth, Controller.getAssistants);
router.get('/assistants/:id/files', auth, Controller.getVectorFiles);
router.get('/assistants/:id', auth, Controller.getAssistants);
router.get('/tools', auth, Controller.getTools);
router.get('/tools/:id', auth, Controller.getToolOne);
//POSTS
router.post('/assistants', auth, Controller.createAssistant);
router.post('/tools', auth, Controller.postTool);
// PATCHES
router.patch('/assistants/:id', auth, Controller.updateAssistant);
router.patch('/assistants/:id/files', auth, Controller.updateVectorFiles);
router.patch('/tools/:id', auth, Controller.patchTool);
// DELETES
router.delete('/assistants/:id', auth, Controller.deleteAssistant);
router.delete('/assistants/:id/files', auth, Controller.deleteVectorFile);
router.delete('/tool/:id', auth, Controller.deleteTool);
// WEB SOCKETS
router.ws('/websocket', Controller.websocket);


module.exports = router;