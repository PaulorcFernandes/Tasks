import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { TasksService } from '../../services/tasks.service';  
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { NotifierService } from 'angular-notifier';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.page.html',
  styleUrls: ['./tasks-list.page.scss'],
})
export class TasksListPage{

  tasks$: Observable<Task[]>

  constructor( private navCtrl:NavController,
               private tasksService: TasksService,
               private overlayService: OverlayService,
               private notifier: NotifierService) { }

   async ionViewDidEnter(): Promise<void> {
    const loading = await this.overlayService.loading();
    this.tasks$ = this.tasksService.getAll();
    this.tasks$.pipe(take(1)).subscribe( tasks => loading.dismiss());
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
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

  async onDone(task: Task): Promise<void> {
    const taskToUpdate = { ...task, done:!task.done };
    await this.tasksService.update(taskToUpdate);
    this.showNotification(
      'success',
      `Atividade "${task.title}" ${taskToUpdate.done ? 'foi completada' : 'foi atualizada'}`
    );
  }

}