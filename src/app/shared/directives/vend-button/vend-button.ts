import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appVendButton]',
})
export class VendButton {
  @Input() borderRadius: string = 'rounded-2xl';
  @Input() colorScheme: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' =
    'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() class: string = '';
  @Input() disabled: boolean = false;

  private baseClasses = 'font-semibold shadow-lg transition-all duration-200 ease-in-out';

  private colorSchemes = {
    default:
      'bg-linear-to-r from-sky-600 to-sky-800 text-white hover:from-sky-700 hover:to-sky-900',
    primary:
      'bg-linear-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900',
    secondary:
      'bg-linear-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800',
    success:
      'bg-linear-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800',
    warning:
      'bg-linear-to-r from-yellow-500 to-yellow-700 text-white hover:from-yellow-600 hover:to-yellow-800',
    danger: 'bg-linear-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800',
  };

  private sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit() {
    this.updateClasses();
  }

  ngOnChanges() {
    this.updateClasses();
  }

  private updateClasses() {
    const button = this.el.nativeElement;

    // Clear existing classes
    this.renderer.setAttribute(button, 'class', '');

    // Build class string
    const classes = [
      this.baseClasses,
      this.colorSchemes[this.colorScheme],
      this.sizes[this.size],
      this.borderRadius,
      this.class,
      this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    ]
      .filter(Boolean)
      .join(' ');

    // Apply classes
    classes.split(' ').forEach((className) => {
      this.renderer.addClass(button, className);
    });

    // Set disabled attribute
    if (this.disabled) {
      this.renderer.setAttribute(button, 'disabled', 'true');
    } else {
      this.renderer.removeAttribute(button, 'disabled');
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
