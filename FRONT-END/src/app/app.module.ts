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

const config: Routes = [
  { "path": "", "component": VHomeComponent },
  { "path": "home", "component": VHomeComponent },
  { "path": "login", "component": VLoginComponent },
  { "path": "register", "component": VRegisterComponent },
  { "path": "**", "component": VHomeComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    VHomeComponent,
    VLoginComponent,
    VRegisterComponent
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
