import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

// Component for the modal
import { CreateEventComponent } from './create-event.component';

@NgModule({
  declarations: [
    CreateEventComponent, // Déclaration du composant
  ],
  imports: [
    CommonModule, // Nécessaire pour les directives Angular
    ReactiveFormsModule, // Pour le FormBuilder et les formulaires réactifs

    // Angular Material Modules
    MatDialogModule, // Pour la gestion des dialogues (modales)
    MatFormFieldModule, // Pour les champs de formulaire stylés
    MatInputModule, // Pour les champs d'entrée
    MatButtonModule, // Pour les boutons
    MatDatepickerModule, // Pour le sélecteur de dates
    MatNativeDateModule, // Fournit la gestion des dates natives
    MatIconModule, // Pour les icônes Material
  ],
  exports: [
    CreateEventComponent, // Permet l'utilisation de ce composant dans d'autres modules
  ],
  //   providers: [
  //     MatDatepickerModule, // Fournisseur nécessaire pour le composant Datepicker
  //   ],
})
export class CreateEventModule {}
