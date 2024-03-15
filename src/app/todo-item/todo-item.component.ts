import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  @Input() todo: any;
  @Output() toRenderListEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() isEdittedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() currentTodoEvent: EventEmitter<any> = new EventEmitter<any>();

  isExpanded: boolean = false;
  isEditted: boolean = false;
  confirmationMsg: string = '';
  showConfirmMsg: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  // getting class for a todo item regarding priority
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  // expanding content in todo and shrinking
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  // creating the message and opening delete modal
  handleDeleteItemBtn(title: string) {
    this.confirmationMsg = `Are you sure you want to delete this ${title.toLocaleUpperCase()} task?`;
    this.showConfirmMsg = true;
  }

  // closing delete modal message
  handleCancelDelete() {
    this.showConfirmMsg = false;
  }

  // closing message modal and deleting todo/task
  handleConfirmDelete(id: number) {
    this.showConfirmMsg = false;
    this.deleteTodo(id);
  }

  // changing state of being checked or unchecked
  handleEdit(todo: any) {
    this.isEditted = true;
    this.isEdittedEvent.emit(true);
    this.currentTodoEvent.emit(todo);
  }

  // changing state of being checked or unchecked
  toggleTodoStatus(event: any) {
    this.todo.attributes.checked = event.target.checked;
    this.updateTodo();
  }

  // updating todo and posting to the backend api
  updateTodo() {
    const updatedTodo = {
      data: {
        title: this.todo.attributes.title,
        description: this.todo.attributes.description,
        priority: this.todo.attributes.priority,
        dueDate: this.todo.attributes.dueDate,
        checked: this.todo.attributes.checked,
        category: this.todo.attributes.category,
      },
    };

    this.apiService.updateTodo(updatedTodo, this.todo.id).subscribe({
      next: (response) => {
        console.log('Todo successfuly created:', response);
        this.toRenderListEvent.emit(true);
      },
      error: (error) => {
        console.error('Error while creating todo:', error);
      },
    });
  }

  // delete todo from the backend api
  deleteTodo(id: any) {
    this.apiService.deleteTodo(id).subscribe({
      next: (response) => {
        this.toRenderListEvent.emit(true);
        console.log('Kategorija je uspješno izbrisana:', response);
      },
      error: (error) => {
        console.error('Greška prilikom brisanja kategorije:', error);
      },
    });
  }
}
