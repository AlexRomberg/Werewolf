import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LucideAngularComponent, LucideAngularModule } from "lucide-angular";

@Component({
    selector: "app-home",
    imports: [RouterLink, LucideAngularModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.css"
})
export class HomeComponent {

}
