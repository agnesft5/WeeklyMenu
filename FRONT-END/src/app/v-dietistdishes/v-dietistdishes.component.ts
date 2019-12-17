import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-v-dietistdishes',
  templateUrl: './v-dietistdishes.component.html',
  styleUrls: ['./v-dietistdishes.component.css']
})
export class VDietistdishesComponent implements OnInit {

  vista:string = 'loggedIn'

  constructor() { }

  ngOnInit() {
  }

}
