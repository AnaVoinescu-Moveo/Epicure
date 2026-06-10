import { JwtUser } from './jwt-user.interface';

export interface AuthenticatedRequest {
  user: JwtUser;
}
