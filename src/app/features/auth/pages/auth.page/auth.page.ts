import { Component } from '@angular/core';
import { VendButton } from "../../../../shared/directives/vend-button/vend-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-auth.page',
  imports: [VendButton, RouterLink],
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.css',
})
export class AuthPage {

}
