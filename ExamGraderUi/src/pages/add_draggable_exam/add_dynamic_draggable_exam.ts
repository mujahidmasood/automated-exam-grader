import {Component} from '@angular/core';
import {FormBuilder} from "@angular/forms";

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'page-dynamic',
    templateUrl: 'dynamic.html',
})
export class AddDraggleExamPage {


    formFields = [];
    current_field: any = {};
    guid = 1;
    dragElements = [
        {
            'Name': "Exam Header.",
            'Type': "header",
            'headers': [
                {
                    Name: "Matriculation Number",
                    Value: "",
                    Type: "text",
                    Required: true
                },
                {
                    Name: "Course",
                    Value: "",
                    Type: "text",
                    Required: true
                },
                {
                    Name: "Semester",
                    Value: "",
                    Type: "text",
                    Required: true
                },
                {
                    Name: "Year",
                    Value: "",
                    Type: "text",
                    Required: true
                },
                {
                    Name: "Instructor",
                    Value: "",
                    Type: "text",
                    Required: false
                },
                {
                    Name: "Full Name",
                    Value: "",
                    Type: "text",
                    Required: true
                },


            ],
            'Settings': [{
                'Name': 'Field Label',
                'Value': 'Single Text',
                'Type': 'text'
            }, {
                'Name': 'Short Label',
                'Value': 'Single Text',
                'Type': 'text'
            }, {
                'Name': 'Internal Name',
                'Value': 'xSingle_Text',
                'Type': 'text'
            }, {
                'Name': 'Field Type',
                'Value': 'Single Text',
                'Type': 'string'
            }, {
                'Name': 'Single Line Text Options',
                'Value': '',
                'Type': 'label'
            }, {
                'Name': 'Max Input Length',
                'Value': '50',
                'Type': 'text'
            }, {
                'Name': 'Url Template',
                'Value': '',
                'Type': 'text'
            }, {
                'Name': 'Column Span',
                'Value': '1',
                'Type': 'dropdown',
                'PossibleValue': ['1', '2']
            }, {
                'Name': 'General Options',
                'Type': 'checkBoxZone',
                'Options': [{
                    'Name': 'Required',
                    'Value': false
                }, {
                    'Name': 'Show on list',
                    'Value': false
                }, {
                    'Name': 'Unique',
                    'Value': false
                }, {
                    'Name': 'Index',
                    'Value': false
                }]
            }

            ]
        }
        ,
        {
            'Name': "Question no.",
            'Type': "text",
            'Settings': [{
                'Name': 'Field Label',
                'Value': 'Single Text',
                'Type': 'text'
            }, {
                'Name': 'Short Label',
                'Value': 'Single Text',
                'Type': 'text'
            }, {
                'Name': 'Internal Name',
                'Value': 'xSingle_Text',
                'Type': 'text'
            }, {
                'Name': 'Field Type',
                'Value': 'Single Text',
                'Type': 'string'
            }, {
                'Name': 'Single Line Text Options',
                'Value': '',
                'Type': 'label'
            }, {
                'Name': 'Max Input Length',
                'Value': '50',
                'Type': 'text'
            }, {
                'Name': 'Url Template',
                'Value': '',
                'Type': 'text'
            }, {
                'Name': 'Column Span',
                'Value': '1',
                'Type': 'dropdown',
                'PossibleValue': ['1', '2']
            }, {
                'Name': 'General Options',
                'Type': 'checkBoxZone',
                'Options': [{
                    'Name': 'Required',
                    'Value': false
                }, {
                    'Name': 'Show on list',
                    'Value': false
                }, {
                    'Name': 'Unique',
                    'Value': false
                }, {
                    'Name': 'Index',
                    'Value': false
                }]
            }

            ]
        }

        ,
        {
            'Name': "Date",
            'Type': "date",
            'Settings': [{
                'Name': 'Field Label',
                'Value': 'Field Label',
                'Type': 'text'
            }, {
                'Name': 'Short Label',
                'Value': 'Short Label',
                'Type': 'text'
            }, {
                'Name': 'Internal Name',
                'Value': 'Internal Name',
                'Type': 'text'
            }, {
                'Name': 'Field Type',
                'Value': 'Date',
                'Type': 'string'
            }, {
                'Name': 'Display Type',
                'Value': '',
                'Type': 'radio',
                'PossibleValue': [
                    {
                        'Text': 'DateTimeInstance',
                        'Checked': true
                    },
                    {
                        'Text': 'DateTimeLocal',
                        'Checked': false
                    },
                    {
                        'Text': 'DateLocal',
                        'Checked': false
                    },
                    {
                        'Text': 'Time',
                        'Checked': false
                    },
                ]
            }, {
                'Name': 'Column Span',
                'Value': '1',
                'Type': 'dropdown',
                'PossibleValue': ['1', '2']
            }, {
                'Name': 'General Options',
                'Type': 'checkBoxZone',
                'Options': [{
                    'Name': 'Required',
                    'Value': false
                }, {
                    'Name': 'Show on list',
                    'Value': false
                }, {
                    'Name': 'Unique',
                    'Value': false
                }, {
                    'Name': 'Index',
                    'Value': false
                }]
            }

            ]
        },
        {
            'Name': "Singe Selection",
            "Type": "dropdown",
            'Settings': [{
                'Name': 'Field Label',
                'Value': 'Field Label',
                'Type': 'text'
            }, {
                'Name': 'Short Label',
                'Value': '',
                'Type': 'text'
            }, {
                'Name': 'Internal Name',
                'Value': 'Short Label',
                'Type': 'text'
            }, {
                'Name': 'Field Type',
                'Value': 'Single Selection',
                'Type': 'string'
            }, {
                'Name': 'Display Type',
                'Value': '',
                'Type': 'radio',
                'PossibleValue': [
                    {
                        'Text': 'Dropdown',
                        'Checked': true
                    },
                    {
                        'Text': 'Radio List',
                        'Checked': false
                    }
                ]
            }, {
                'Name': 'Choice',
                'Type': 'dropdown_increment',
                'PossibleValue': [
                    {
                        'Text': 'Choice 1',

                    }
                    , {
                        'Text': 'Choice 2'
                    }
                ]
            }, {
                'Name': 'Column Span',
                'Value': '1',
                'Type': 'dropdown',
                'PossibleValue': ['1', '2']
            }, {
                'Name': 'General Options',
                'Type': 'checkBoxZone',
                'Options': [{
                    'Name': 'Required',
                    'Value': false
                }, {
                    'Name': 'Show on list',
                    'Value': false
                }, {
                    'Name': 'Unique',
                    'Value': false
                }, {
                    'Name': 'Index',
                    'Value': false
                }]
            }

            ]
        },
        {
            'Name': "Pagaraph Text",
            "Type": "textarea",
            'Settings': [{
                'Name': 'Field Label',
                'Value': '',
                'Type': 'text'
            }, {
                'Name': 'Short Label',
                'Value': '',
                'Type': 'text'
            }, {
                'Name': 'Internal Name',
                'Value': '',
                'Type': 'text'
            }, {
                'Name': 'Field Type',
                'Value': 'Paragraph Text',
                'Type': 'string'
            }, {
                'Name': 'Column Span',
                'Value': '1',
                'Type': 'dropdown',
                'PossibleValue': ['1', '2']
            }, {
                'Name': 'General Options',
                'Type': 'checkBoxZone',
                'Options': [{
                    'Name': 'Required',
                    'Value': false
                }, {
                    'Name': 'Enable Rich Text',
                    'Value': false
                }, {
                    'Name': 'Active',
                    'Value': true
                }, {
                    'Name': 'Hidden',
                    'Value': false
                }]
            }

            ]
        }

    ]

    constructor(private fb: FormBuilder) {

    }


    createNewField() {
        return {
            'id': ++this.guid,
            'Name': '',
            'Settings': [],
            'Active': true,
            'ChangeFieldSetting': function (Value, SettingName) {
                switch (SettingName) {
                    case 'Field Label':
                    case 'Short Label':
                    case 'Internal Name':
                        this.current_field.Name = Value;
                        this.current_field.Settings[0].Value = this.current_field.Name;
                        this.current_field.Settings[1].Value = this.current_field.Name;
                        this.current_field.Settings[2].Value = 'x' + this.current_field.Name.replace(/\s/g, '_');
                        break;
                    default:
                        break;
                }
            },
            'GetFieldSetting': function (settingName) {
                var result = {};
                let settings = this.Settings;

                settings.forEach(set => {
                    if (set.Name == settingName) {
                        result = set;
                        return;
                    }
                });

                if (!Object.keys(result).length) {
                    this.Settings[this.Settings.length - 1].Options.forEach((set) => {
                        if (set.Name == settingName) {
                            result = set;
                            return;
                        }
                    });
                }
                return result;

            }
        };
    }

    changeFieldName(Value) {
        this.current_field.Name = Value;
        this.current_field.Settings[0].Value = this.current_field.Name;
        this.current_field.Settings[1].Value = this.current_field.Name;
        this.current_field.Settings[2].Value = 'x' + this.current_field.Name.replace(/\s/g, '_');
    }

    removeElement(idx) {
        if (this.formFields[idx].Active) {
            //document.getElementById('#addFieldTab_lnk').tab('show');
            this.current_field = null;

        }
        this.formFields.splice(idx, 1);
    };

    addElement(ele, idx) {

        this.current_field = this.createNewField();
        Object.assign(this.current_field, ele);

        if (typeof idx == 'undefined') {
            this.formFields.push(this.current_field);
        } else {
            this.formFields.splice(idx, 0, this.current_field);
            //  document.getElementById('#fieldSettingTab_lnk').tab('show');
        }

    };

    activeField(f) {
        this.current_field.Active = false;
        this.current_field = f;
        f.Active = true;
        // $('#fieldSettingTab_lnk').tab('show');
    };

    submitForm(form) {
        console.log('form', form)
    }

    formbuilderSortableOpts = {
        'ui-floating': true,
    };
}

// )();
//
//     $(
//
//     function() {
//         // Code here
//         var dh = $(document).height();
//         $('#sidebar-tab-content').height(dh - 115);
//         $('#main-content').height(dh - 10);
//     }
//
// );
// }
