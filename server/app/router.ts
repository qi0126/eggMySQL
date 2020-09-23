import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  // router.get('/', controller.home.index);
  router.post('/login', controller.login.login);
  router.get('/detail/:id', controller.home.detail);
  router.get('/delete/:id', controller.home.delete);
  router.get('/findAll', controller.home.findAll);
  router.post('/insert', controller.home.insert);
  router.post('/edit', controller.home.edit);
};
