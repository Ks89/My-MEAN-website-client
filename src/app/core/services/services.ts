import { Project, ProjectHomeView,
  ProjectGallery, Author,
  ProjectService } from './projects.service';
import { Response, ProfileService } from './profile.service';
import { ContactService } from './contact.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';

export { Project, ProjectHomeView,
  ProjectGallery, Author,
  ProjectService } from './projects.service';
export { Response, ProfileService } from './profile.service';
export { ContactService } from './contact.service';
export { AuthService } from './auth.service';
export { AuthGuard } from './auth-guard.service';

export const CORE_SERVICES: any[] = [
  ProjectService, ProfileService, ContactService,
  AuthService, AuthGuard
];
