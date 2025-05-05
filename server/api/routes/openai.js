const router = require('express').Router();
const Controller = require('../controllers/openai');
const { auth } = require('../middlewares/authorization');

router.get('/', Controller.get);
router.ws('/websocket', Controller.websocket);

// GETS
router.get('/assistants', auth, Controller.getAssistants);
router.get('/assistants/:id', auth, Controller.getAssistants);
router.get('/assistants/:id/files', auth, Controller.getVectorFiles);
//POSTs
router.post('/assistants', auth, Controller.createAssistant);
// PATCHES
router.patch('/assistants/:id', auth, Controller.updateAssistant);
router.patch('/assistants/:id/files', auth, Controller.updateVectorFiles);
// DELETES
router.delete('/assistants/:id', auth, Controller.deleteAssistant);
router.delete('/assistants/:id', auth, Controller.deleteVectorFile);


module.exports = router;