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
  ],
})
export class NavigationComponent implements OnInit {
  @Output() showTodoFormEvent = new EventEmitter<boolean>();
  @Output() showCategoryFormEvent = new EventEmitter<boolean>();
  @Output() showTodoListEvent = new EventEmitter<boolean>();

  showNavigation: boolean = false;
  screenWidth!: number;
  categories: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth();
    this.getCategories();
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

  // close navigation if clicked outside of nav btn and navigaton cont
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (
      this.showNavigation === true &&
      event.target &&
      !(event.target as HTMLElement).closest('.side-nav-cont') &&
      !(event.target as HTMLElement).closest('.show-nav-btn') &&
      this.screenWidth < brakePoint1
    ) {
      this.showNavigation = false;
    }
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

  // open todo form and close todo list
  showTodoForm() {
    this.showTodoFormEvent.emit(true);
    this.showTodoListEvent.emit(false);
  }

  // open category form and close todo list
  showCategoryForm() {
    this.showCategoryFormEvent.emit(true);
    this.showTodoListEvent.emit(false);
  }

  handleDeleteCategoryBtn(id: any) {
    this.apiService.deleteCategory(id).subscribe({
      next: (response) => {
        console.log('Kategorija je uspješno izbrisana:', response);
        this.getCategories();
      },
      error: (error) => {
        console.error('Greška prilikom brisanja kategorije:', error);
      },
    });
  }
}
