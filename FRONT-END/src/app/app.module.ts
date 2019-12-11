import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VHomeComponent } from './v-home/v-home.component';
import { VLoginComponent } from './v-login/v-login.component';
import { VRegisterComponent } from './v-register/v-register.component';

import { UserService } from './services/user.service';

import { RouterModule, Routes, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { VDetailsComponent } from './v-details/v-details.component';
import { AuthGuard } from './servieces/auth.guard';

const config: Routes = [
  { "path": "", "component": VHomeComponent },
  { "path": "home", "component": VHomeComponent },
  { "path": "login", "component": VLoginComponent },
  { "path": "register", "component": VRegisterComponent },
  { "path": "details", "component": VDetailsComponent, "canActivate": [AuthGuard] },
  { "path": "**", "component": VHomeComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    VHomeComponent,
    VLoginComponent,
    VRegisterComponent,
    VDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(config, { useHash: true })
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
