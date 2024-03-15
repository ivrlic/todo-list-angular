import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { brakePoint1 } from '../const/const-screen-width';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  animations: [
    //  side navigation animation
    trigger('openClose', [
      state(
        'open',
        style({
          transform: 'translateX(0)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'translateX(-100%)',
        })
      ),
      transition('open => closed', [animate('0.15s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
    // sort options animation
    trigger('openCloseSort', [
      state(
        'open',
        style({
          transform: 'translateY(0)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'translateY(-100%)',
        })
      ),
      transition('open => closed', [animate('0.15s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class NavigationComponent implements OnInit {
  @Output() showTodoFormEvent = new EventEmitter<boolean>();
  @Output() showCategoryFormEvent = new EventEmitter<boolean>();
  @Output() showTodoListEvent = new EventEmitter<boolean>();

  showNavigation: boolean = false;
  showSortOptions: boolean = false;
  screenWidth!: number;
  categories: any[] = [];
  todos: any[] = [];
  confirmationMsg: string = '';
  showConfirmMsg: boolean = false;
  currentCategoryId!: number;
  todosInCategory: any[] = [];
  showRegModal: boolean = false;
  showLoginModal: boolean = false;
  username: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth();
    this.getCategories();
    this.getTodos();
    this.username = localStorage.getItem('username') || '';
    // this.username = this.apiService.getUsername();
  }

  // while resizing checking screen size and showing or hiding navigation according to the screen size
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth();
  }

  // if screen width is as desktop screen show navigation, else hide it
  checkScreenWidth() {
    if (this.screenWidth >= brakePoint1) {
      this.showNavigation = true;
    } else {
      this.showNavigation = false;
    }
  }

  // toggle navigation (on click), but only if screen is narrower than desktop screen
  toggleNavigation() {
    if (this.screenWidth < brakePoint1) {
      this.showNavigation = !this.showNavigation;
    }
  }

  // toggle navigation (on click), but only if screen is narrower than desktop screen
  toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  // close navigation if clicked outside of nav btn and navigaton cont
  // close sort options if clicked outside of sort options (mat-form-field)
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    // closing side navigation
    if (
      this.showNavigation === true &&
      event.target &&
      !(event.target as HTMLElement).closest('.side-nav-cont') &&
      !(event.target as HTMLElement).closest('.show-nav-btn') &&
      this.screenWidth < brakePoint1
    ) {
      this.showNavigation = false;
    }

    // closing sort options
    if (
      this.showSortOptions === true &&
      event.target &&
      !(event.target as HTMLElement).closest('.header-right-cont p') &&
      !(event.target as HTMLElement).closest('mat-form-field')
    ) {
      this.showSortOptions = false;
    }
  }

  // sorting function
  handleSorting(sortCond: string) {
    const sortPartUrl = this.getSortPartUrl(sortCond);
    this.apiService.setSortPartUrlTodos(sortPartUrl);
    this.apiService.setTodoUrlWithCategory(sortPartUrl);

    // close todo form and category form if open
    this.showTodoFormEvent.emit(false);
    this.showCategoryFormEvent.emit(false);

    // in order to render todo list hide it and than show it again after short period of time
    // and close todo form and category form
    this.showTodoListEvent.emit(false);
    setTimeout(() => {
      this.showTodoListEvent.emit(true);
    }, 100);
  }

  // filtering function
  handleFiltering(filter: string) {
    const filterPartUrl = this.getFilterPartUrl(filter);
    this.apiService.setFilterPartUrlTodos(filterPartUrl);
    this.apiService.setTodoUrlWithCategory(undefined, filterPartUrl);

    // close todo form and category form if open
    this.showTodoFormEvent.emit(false);
    this.showCategoryFormEvent.emit(false);

    // in order to render todo list hide it and than show it again after short period of time
    this.showTodoListEvent.emit(false);
    setTimeout(() => {
      this.showTodoListEvent.emit(true);
    }, 100);
  }

  // sorting todos by dueDate and updated time
  // getting sort part url to combine it in api.service with base and filter part and to get todoUrlWithCategory
  getSortPartUrl(sortCond: string): string {
    switch (sortCond) {
      // ascending (from an earlier to a later dueDate)
      case 'dueDateAsc':
        return '[sort]=dueDate%3Aasc';
      // descending (from a later to an earlier dueDate)
      case 'dueDateDesc':
        return '[sort]=dueDate%3Adesc';

      // ascending (from an earlier to a later updated time)
      case 'updTimeAsc':
        return '[sort]=updatedAt%3Aasc';
      // descending (from a later to an earlier updated time)
      case 'updTimeDesc':
        return '[sort]=updatedAt%3Adesc';

      // default like descending updated time
      default:
        return '[sort]=updatedAt%3Adesc';
    }
  }

  // filtering todos by checked attribute, time/date, and category
  // getting filter part url to combine it in api.service with base and sort part and get todoUrlWithCategory
  getFilterPartUrl(filter: string): string {
    const today = new Date();
    const formattedToday = this.formatDate(today);

    switch (filter) {
      // all todos
      case 'all':
        return 'populate[0]=category';
      // completed/checked todos
      case 'completed':
        return '[filters][checked][$eq]=true&populate[0]=category';
      // uncompleted/unchecked todos
      case 'uncompleted':
        return '[filters][checked][$eq]=false&populate[0]=category';

      // overdue todos (before today's date)
      case 'overDue':
        return `[filters][dueDate][$lt]=${formattedToday}&populate[0]=category`;
      // upcoming todos (after today's date)
      case 'upcoming':
        return `[filters][dueDate][$gt]=${formattedToday}&populate[0]=category`;
      // today's date
      case 'today':
        return `[filters][dueDate][$eq]=${formattedToday}&populate[0]=category`;

      // category
      case filter: // category title
        return `[filters][category][title][$eq]=${filter}&populate[0]=category`;

      // default like all todos
      default:
        return 'populate[0]=category';
    }
  }

  // formating date for url
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  // getting two digits
  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  handleShowLogin() {
    this.showLoginModal = true;
  }

  // open todo form and close todo list
  showTodoForm() {
    this.showTodoFormEvent.emit(true);
    this.showTodoListEvent.emit(false);
    this.showCategoryFormEvent.emit(false);
  }

  // open category form and close todo list
  showCategoryForm() {
    this.showCategoryFormEvent.emit(true);
    this.showTodoListEvent.emit(false);
    this.showTodoFormEvent.emit(false);
  }

  // closing message modal
  handleCancelDelete() {
    this.showConfirmMsg = false;
  }

  // closing message modal and deleting category with all todos inside
  handleConfirmDelete() {
    // deleting category
    this.apiService.deleteCategory(this.currentCategoryId).subscribe({
      next: (response) => {
        console.log('Category successfully deleted:', response);
        // this.getCategories();
      },
      error: (error) => {
        console.error('Error while deleting category:', error);
      },
    });

    // deleting all related todos
    this.todosInCategory.forEach((todo) => {
      this.deleteTodo(todo.id);
    });
    this.showConfirmMsg = false;
    this.getTodos();
    this.showTodoListEvent.emit(false);
    setTimeout(() => {
      this.showTodoListEvent.emit(true);
    }, 100);
  }

  // function for clicking on a bin to delete category
  handleDeleteCategoryBtn(id: any, title: string) {
    this.getTodos();
    this.currentCategoryId = id;
    this.todosInCategory = this.getTodosInCategory(id);

    // creating messages for confirm delete modal
    if (this.todosInCategory.length > 0) {
      const word = this.todosInCategory.length === 1 ? 'todo' : 'todos';
      this.confirmationMsg = `The ${title} category is related to ${this.todosInCategory.length} existing ${word}. Are you sure you want to delete the ${title} category with ${this.todosInCategory.length} related ${word}?`;
    } else {
      this.confirmationMsg = `Are you sure you want to delete the ${title} category?`;
    }

    this.showConfirmMsg = true;
  }

  // getting todos with the same id as a category id
  getTodosInCategory(id: number) {
    return this.todos.filter((todo) => {
      return todo.attributes.category.data?.id === id;
    });
  }

  // deleting a todo
  deleteTodo(id: any) {
    this.apiService.deleteTodo(id).subscribe({
      next: (response) => {
        console.log('Todo successfully deleted:', response);
      },
      error: (error) => {
        console.error('Error while deleting todo:', error);
      },
    });
  }

  // get todos from api
  getTodos() {
    this.apiService.getTodos().subscribe({
      next: (response: any) => {
        this.todos = response.data;
      },
      error: (error) => {
        console.log('Error fetching todos: ', error);
      },
    });
  }

  // getting categories from the api (upper case)
  getCategories() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }
}
