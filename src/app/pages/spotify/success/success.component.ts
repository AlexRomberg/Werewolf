import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: "app-success",
    imports: [RouterLink, LucideAngularModule],
    templateUrl: "./success.component.html"
})
export class SuccessComponent {
}
