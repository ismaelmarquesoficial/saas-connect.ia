declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      tenant_id: string;
      role: string;
    }
  }
} 