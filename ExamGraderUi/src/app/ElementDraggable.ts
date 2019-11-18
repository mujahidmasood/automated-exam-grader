import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[elementDraggable]'
})

export class ElementDraggable {

    @HostListener('dragstart', ['$event'])
    onDragStart(event, element) {

        event.originalEvent.dataTransfer.setData('templateIdx', $(element).data('index'));
    }

}