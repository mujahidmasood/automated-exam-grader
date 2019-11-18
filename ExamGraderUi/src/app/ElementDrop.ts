import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[elementDraggable, .drop]'
})

export class ChangeTextDirective {


    @HostListener('dragover', ['$event'])
    onDragStart(event, element) {

        event.preventDefault();
    }

    @HostListener('dragenter', ['$event'])
    onDragEnter(event, element) {

        //$('.drop').on('dragenter', function (event) {
        element.on('', function (event) {
            event.preventDefault();
        });
        // })
    }

    @HostListener('drop', ['$event'])
    drop(event, element) {

        element.on('drop', function (event) {
            event.stopPropagation();
            var self = $(this);
            this.$apply(function () {
                var idx = event.originalEvent.dataTransfer.getData('templateIdx');
                var insertIdx = self.data('index')
                this.addElement(this.dragElements[idx], insertIdx);
            });
        });
    }

}