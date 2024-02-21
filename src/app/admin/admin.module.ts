import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { FooterModule } from "../shared/components/footer/footer.module";


@NgModule({
    declarations: [
        AdminComponent, HomeComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FooterModule
    ]
})
export class AdminModule { }
