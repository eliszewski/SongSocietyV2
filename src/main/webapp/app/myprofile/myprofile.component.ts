// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'jhi-myprofile',
//   templateUrl: './myprofile.component.html',
//   styleUrls: ['./myprofile.component.scss']
// })
// export class MyprofileComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {

//   }

// }
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { PosterService } from 'app/entities/poster/service/poster.service';
import { IPoster } from 'app/entities/poster/poster.model';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { UserManagementService } from 'app/admin/user-management/service/user-management.service';
import { IUser } from 'app/admin/user-management/user-management.model';
import { UserService } from 'app/entities/user/user.service';
import { User } from 'app/entities/user/user.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-profile-detail',
  templateUrl: './myprofile.component.html',
  // styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  loggedInPoster: IPoster | null = null;
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  user: IUser | null = null;
  userId: number | null = 1;
  entitiesNavbarItems: any[] = [];

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private posterService: PosterService,
    private userManagementService: UserManagementService,
    private UserService: UserService,
    protected dataUtils: DataUtils,

    private router: Router
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    console.log(this.user);
    this.user = this.getTheUserId();
    console.log(this.user);
    if (this.user?.id) this.getThePoster(this.user.id);
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  myProfile(): void {
    this.router.navigate(['/poster', this.loggedInPoster?.id, 'view']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  getTheUserId(): IUser | null {
    if (this.account?.login)
      this.userManagementService.find('user').subscribe(response => {
        console.log(response);
        return response;
      });
    return null;
  }
  //custom
  getThePoster(id: number): void {
    const user = this.getTheUserId()?.id;
    if (user)
      this.posterService.getPosterByUserId(id).subscribe(response => {
        console.log(response);
        this.loggedInPoster = response.body;
      });
  }
  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
