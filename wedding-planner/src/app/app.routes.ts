import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'citas',
        loadComponent: () => import('./pages/citas/citas.component').then(m => m.CitasComponent)
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./pages/proveedores/proveedores.component').then(m => m.ProveedoresComponent)
      },
      {
        path: 'planeador',
        loadComponent: () => import('./pages/planeador/planeador.component').then(m => m.PlaneadorComponent)
      },
      {
        path: 'logistica',
        loadComponent: () => import('./pages/logistica/logistica.component').then(m => m.LogisticaComponent)
      },
      {
        path: 'hoteles',
        loadComponent: () => import('./pages/hoteles/hoteles.component').then(m => m.HotelesComponent)
      },
      {
        path: 'cupones',
        loadComponent: () => import('./pages/cupones/cupones.component').then(m => m.CuponesComponent)
      },
      {
        path: 'galeria',
        loadComponent: () => import('./pages/galeria/galeria.component').then(m => m.GaleriaComponent)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./pages/carrito/carrito.component').then(m => m.CarritoComponent)
      }
    ]
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
