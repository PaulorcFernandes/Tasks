import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';  
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.page.html',
  styleUrls: ['./tasks-list.page.scss'],
})
export class TasksListPage{

  tasks$: Observable<Task[]>

  constructor( private navCtrl:NavController,
               private tasksService: TasksService,
               private overlayService: OverlayService) { }

   ionViewDidEnter(): void {
    this.tasks$ = this.tasksService.getAll();
    console.log(this.tasks$)
  } 

  onUpdate(task: Task): void {
    this.navCtrl.navigateForward(`/tasks-list/edit/${task.id}`)
  }
  
  async onDelete(task:Task):Promise<void> {
    await this.overlayService.alert({
      message: `Deseja deletar a tarefa "${task.title}"?`,
      buttons: [
        {
          text: 'Sim',
          handler: async ()=> {
            await this.tasksService.delete(task);
            await this.overlayService.toast({
              message: `Tarefa "${task.title}" deletada!`
            })
          }
        },
        'Não'
      ]
    })
  }

}