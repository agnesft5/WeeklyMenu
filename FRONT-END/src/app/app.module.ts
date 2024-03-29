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
import { VSingleMenuComponent } from './v-single-menu/v-single-menu.component';
import { VAddDishComponent } from './v-add-dish/v-add-dish.component';
import { DietistGuard } from './services/dietist.guard';
import { VDietComponent } from './v-diet/v-diet.component';
import { VDietistdishesComponent } from './v-dietistdishes/v-dietistdishes.component';
import { VSelectedmenuComponent } from './v-selectedmenu/v-selectedmenu.component';

const config: Routes = [
  { "path": "", "component": VHomeComponent },
  { "path": "home", "component": VHomeComponent },
  { "path": "login", "component": VLoginComponent },
  { "path": "register", "component": VRegisterComponent },
  { "path": "details", "component": VDetailsComponent, "canActivate": [AuthGuard] },
  { "path": "single-menu", "component": VSingleMenuComponent, "canActivate": [AuthGuard] },
  { "path": "add-dish", "component": VAddDishComponent, "canActivate": [AuthGuard, DietistGuard] },
  { "path": "diet", "component": VDietComponent, "canActivate": [AuthGuard] },
  { "path": "posted-dishes", "component": VDietistdishesComponent, "canActivate": [AuthGuard, DietistGuard] },
  { "path": "selected-menu/:id", "component": VSelectedmenuComponent, "canActivate": [AuthGuard] },
  { "path": "**", "component": VHomeComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    VHomeComponent,
    VLoginComponent,
    VRegisterComponent,
    VDetailsComponent,
    VSingleMenuComponent,
    VAddDishComponent,
    VDietComponent,
    VDietistdishesComponent,
    VSelectedmenuComponent
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
