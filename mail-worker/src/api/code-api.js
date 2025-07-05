import app from '../hono/hono';
import KvConst from '../const/kv-const';
import result from '../model/result';

/**
 * 无需鉴权的验证码获取接口
 * 用于外部脚本轮询获取邮箱收到的验证码
 * @param {string} email - 完整邮箱地址
 * @returns {Object} {success: boolean, code: string|null}
 */
app.get('/code', async (c) => {
  try {
    const email = c.req.query('email');
    
    if (!email || !email.includes('@')) {
      return c.json(result.fail('邮箱参数无效'));
    }
    
    const code = await c.env.kv.get(KvConst.CODE_PREFIX + email.toLowerCase());
    
    return c.json(result.ok({
      success: !!code,
      code: code || null
    }));
  } catch (error) {
    console.error('获取验证码失败:', error);
    return c.json(result.fail('获取验证码失败'));
  }
}); 
