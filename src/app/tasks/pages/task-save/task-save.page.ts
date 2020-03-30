import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import { NavController } from '@ionic/angular';
import { OverlayService } from 'src/app/core/services/overlay.service';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-task-save',
  templateUrl: './task-save.page.html',
  styleUrls: ['./task-save.page.scss'],
})
export class TaskSavePage implements OnInit {

  taskForm: FormGroup;
  pageTitle = '...';
  taskId: string = undefined;

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private navCtrl: NavController,
    private overlayService: OverlayService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.init();
  }

  init(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (!taskId) {
      this.pageTitle = 'Criar atividade';
      return;
    }
    this.taskId = taskId;
    console.log(taskId);
    this.pageTitle = 'Editar atividade';
    this.tasksService.get(taskId)
      .pipe(take(1))
        .subscribe(({title, resume, done}) => {
          this.taskForm.get('title').setValue(title);
          this.taskForm.get('done').setValue(done);
          this.taskForm.get('resume').setValue(resume);
        })
  }

  private createForm(): void{
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      resume: ['', Validators.required],
      done: [false]
    })
  }

  async onSubmit(): Promise<void> {
    const loading = await this.overlayService.loading({
      message: 'Salvando...'
    });
    try{
      const task = !this.taskId 
        ? await this.tasksService.create(this.taskForm.value)
        : await this.tasksService.update({
          id: this.taskId,
          ...this.taskForm.value
        });
      console.log('Salvou...' , task)
      this.navCtrl.navigateBack('/tasks-list');
    }
    catch(error){
      console.log('Error...');
      await this.overlayService.toast({
        message: error.message
      })
    } finally {
      loading.dismiss();
    }
  }
}
