import { ProjectService } from './projects.service';
import { ProfileService } from './profile.service';
import { ContactService } from './contact.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';

export const SERVICES = [
  ProjectService, ProfileService, ContactService, AuthService, AuthGuard
];
