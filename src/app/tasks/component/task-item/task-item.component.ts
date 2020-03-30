import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  
  @Input() task: Task;
  @Output() done = new EventEmitter<Task>();
  @Output() update = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<Task>();


  constructor( public actionSheetController: ActionSheetController) { }

  async menuTask(task) {
    let actionSheet =  await this.actionSheetController.create({
      header: 'Menu da Atividade',
      buttons: [{
        text: 'Editar',
        icon: 'create',
        handler: () => {
          console.log('editar share');
          this.update.emit(task);
        }
      }, {
        text: 'Deletar',
        icon: 'trash',
        handler: () => {
          console.log('deletar clicked');
          this.delete.emit(task);
        }
      },{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

 }

 

 
