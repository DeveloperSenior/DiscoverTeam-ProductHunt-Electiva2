import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./base/guard/auth.guard";


const routes: Routes = [

  {
    path: 'home',
    loadChildren: () => import('../app/components/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'user/:email',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/components/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/components/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'launch-product',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/components/product/product.module').then(m => m.ProductModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
