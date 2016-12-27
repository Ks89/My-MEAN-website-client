/*
 * Copyright (C) 2015-2017 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Observable } from "rxjs";
import { Response as ProfileResponse } from '../services/profile.service';

export const PROFILE_RESPONSE: ProfileResponse = {
  message: "Profile updated successfully!"
};

export const PROFILE_WRONG_RESPONSE: ProfileResponse = {
  message: "Update profile error"
};


export class FakeProfileService {
  update(profile: any): Observable<ProfileResponse> {
    return Observable.of(PROFILE_RESPONSE);
  }
}

export class FakeWrongProfileService {
  update(profile: any): Observable<ProfileResponse> {
    return Observable.throw({
      _body :  JSON.stringify(PROFILE_WRONG_RESPONSE)
    });
  }
}