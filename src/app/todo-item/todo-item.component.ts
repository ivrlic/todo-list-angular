import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  @Input() todo: any;
  @Output() itemChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isEdittedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() currentTodoEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  isExpanded: boolean = false;
  isEditted: boolean = false;

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

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  handleDelete(id: any) {
    this.apiService.deleteTodo(id).subscribe({
      next: (response) => {
        this.itemChanged.emit(true);
        console.log('Kategorija je uspješno izbrisana:', response);
      },
      error: (error) => {
        console.error('Greška prilikom brisanja kategorije:', error);
      },
    });
  }

  handleEdit(todo: any) {
    this.isEditted = !this.isEditted;
    this.isEdittedEvent.emit(!this.isEditted);
    this.currentTodoEvent.emit(todo);
  }

  toggleTodoStatus(event: any) {
    this.todo.attributes.checked = event.target.checked;
    this.updateTodo();
  }

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
      },
      error: (error) => {
        console.error('Error while creating todo:', error);
      },
    });
  }
}
