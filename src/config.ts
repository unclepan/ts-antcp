interface Config {
  readonly secret: string;
  readonly connectionStr: string;
  readonly redis?: any;
  readonly smtp: any;
}

const config: Config = {
  secret: 'antcp-jwt-secret',
  connectionStr: 'mongodb://uncle:Yp123456@localhost:27017/antcp?authSource=admin',
  redis: {
    get host() {
      return '127.0.0.1';
    },
    get port() {
      return 6379;
    }
  },
  smtp: {
    get host() {
      return 'smtp.qq.com';
    },
    get user() {
      return '292222369@qq.com';
    },
    get pass() {
      return 'jifbydmbrazcbjbe';
    },
    get code() {
      return () => {
        return Math.random().toString(16).slice(2, 6).toUpperCase();
      };
    },
    get expire() {
      return () => {
        return new Date().getTime() + 60 * 1000;
      };
    }
  }
};

export default config;