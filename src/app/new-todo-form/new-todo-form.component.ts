import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-todo-form',
  templateUrl: './new-todo-form.component.html',
  styleUrls: ['./new-todo-form.component.css'],
})
export class NewTodoFormComponent {
  todoForm: FormGroup;
  formattedDate: string | null;

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      priority: ['', Validators.required],
      category: ['', Validators.required],
      dueDate: ['', Validators.required],
    });

    const date = new Date();
    this.formattedDate = this.datePipe.transform(date, 'MM/dd/yyyy');
  }

  // constructor(private datePipe: DatePipe) {
  //   // Postavite datum koji želite formatirati
  //   const date = new Date();
  //   this.formattedDate = this.datePipe.transform(date, 'MM/dd/yyyy');
  // }

  createTodo() {
    if (this.todoForm.valid) {
      // Ovdje dodajte logiku za stvaranje novog zadatka
      console.log('New todo created!', this.todoForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
