import Router from 'koa-router';
import Auth from '../middlewares/auth';
import Users from '../controllers/users';
import Topics from '../controllers/topics';
import Questions from '../controllers/questions';
import Answers from '../controllers/answers';
import Periodical from '../controllers/periodical';
import Filter from '../middlewares/filter';

const { parameter, softDelete } = Filter;
const router = new Router({ prefix: '/api/users'});
const {
  find,
  findById,
  whetherName,
  verify,
  create,
  update,
  delete: del,
  login,
  logout,
  checkOwner,
  listFollowing,
  listFollowers,
  checkUserExist,
  follow,
  unfollow,
  listFollowingTopic,
  followTopic,
  unfollowTopic,
  listQuestions,
  listFollowingQuestion,
  followQuestion,
  unfollowQuestion,
  listLikingAnswers,
  likeAnswer,
  unLikeAnswer,
  listDisLikingAnswers,
  disLikeAnswer,
  unDisLikeAnswer,
  listCollectingAnswers,
  collectAnswer,
  unCollectAnswer,
  likePeriodical,
  unLikePeriodical,
  whetherLikePeriodical
} = Users;

const { checkTopicExist } = Topics;
const { checkQuestionExist } = Questions;
const { checkAnswerExist } = Answers;
const { checkPeriodicalExist } = Periodical;

// 用户列表
router.get('/', find);
// 创建用户
router.post('/', parameter, create);
// 修改用户
router.patch('/:id', new Auth().m, checkOwner, checkUserExist, parameter, update);
// 根据ID获取某一个用户
router.get('/:id', findById);
// 检查是否已经存在该用户名
router.get('/whether/name', whetherName);
// 当前登陆的用户信息
router.get('/login/info',
  new Auth().m,
  async(ctx, next) => {
    ctx.params.id = ctx.state.user._id;
    await next();
  },
  findById
);

router.delete('/:id', new Auth().m, checkOwner, del);

router.post('/verify', verify);

router.post('/login', login);

router.post('/logout', logout);
// 用户关注了那些人
router.get('/:id/following', listFollowing);
// 粉丝列表
router.get('/:id/followins', listFollowers);
// 关注某个人
router.put('/following/:id', new Auth().m, checkUserExist, follow);
// 取消关注某个人
router.delete('/following/:id', new Auth().m, checkUserExist, unfollow);

router.get('/:id/followingTopics', listFollowingTopic);

router.put('/followingTopics/:id', new Auth().m, checkTopicExist, followTopic);

router.delete('/followingTopics/:id', new Auth().m, checkTopicExist, unfollowTopic);

router.get('/:id/followQuestions', listFollowingQuestion); // 用户关注问题的列表

router.put('/followQuestions/:id', new Auth().m, checkQuestionExist, followQuestion);

router.delete('/followQuestions/:id', new Auth().m, checkQuestionExist, unfollowQuestion);

router.get('/:id/questions', listQuestions); // 用户提出问题的列表

router.get('/:id/likingAnswers', listLikingAnswers);

router.put(
  '/likingAnswers/:id',
  new Auth().m,
  checkAnswerExist,
  likeAnswer,
  unDisLikeAnswer
);

router.delete('/likingAnswers/:id', new Auth().m, checkAnswerExist, unLikeAnswer);

router.get('/:id/dislikingAnswers', listDisLikingAnswers);

router.put(
  '/dislikingAnswers/:id',
  new Auth().m,
  checkAnswerExist,
  disLikeAnswer,
  unLikeAnswer
);

router.delete('/dislikingAnswers/:id', new Auth().m, checkAnswerExist, unDisLikeAnswer);

router.get('/:id/collectingAnswers', listCollectingAnswers);

router.put('/collectingAnswers/:id', new Auth().m, checkAnswerExist, collectAnswer);

router.delete('/collectingAnswers/:id', new Auth().m, checkAnswerExist, unCollectAnswer);

// 赞期刊
router.put(
  '/likingPeriodical/:id',
  new Auth().m,
  checkPeriodicalExist,
  likePeriodical,
);
// 取消赞期刊
router.delete('/likingPeriodical/:id', new Auth().m, checkPeriodicalExist, unLikePeriodical);
// 是否赞过该期刊
router.get('/whetherLikingPeriodical/:id', new Auth().m, checkPeriodicalExist, whetherLikePeriodical);

// 是否登陆
router.get('/is/login/:token',
  new Auth().isLogin,
  async(ctx, next) => {
    ctx.params.id = ctx.state.user._id;
    await next();
  },
  findById
);

export default router;
