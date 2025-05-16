export type AdminLoginParams = {
    userId: string;
    password: string;
  };

  export type AdminGetListParams = {
    keyword: string;
  };

  export type AdminCreateParams = {
    adminId: string;
    password: string;
    name: string;
    cellphone: string;
    description: string;
    email: string;
    emailYn: string;
    smsYn: string;
  };

  export type TermGetListParams = {
    index: number;
    termsType: string;
    content: string;
  };
