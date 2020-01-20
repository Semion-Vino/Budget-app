var constr = function create(name) {
    this.name = name;
};
var img = new constr('h');
console.log(img);


var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round(this.value / totalInc * 100);


        } else {
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value
        })
        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    }
    return {

        addItem: function (type, des, val) {
            var newItem, ID;
            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //create new item based on the type
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);

            }
            //push the item into the correct array
            data.allItems[type].push(newItem);

            return newItem;
        },

        calculateBudget: function () {
            //calc total income & expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calc the budget: income- expenses
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of income we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp * 100 / data.totals.inc);

            } else {
                data.percentage = -1;
            }
        },
        calculatePercentage: function () {
            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);

            })
            console.log(data.allItems.exp)


        },
        getPercentage: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();

            });

            return allPerc;

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        deleteItem: function (type, id) {
            var ids, index

            ids = data.allItems[type].map(function (current) {
                return current.id;
            })
            index = ids.indexOf(id);
            if (index !== -1) {

                data.allItems[type].splice(index, 1);
            } else {
                console.log('bug')
            }
        },

        testing: function () {
            console.log(data)
        }
    }
})()

var UIController = (function () {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    }

    var formatNumber = function (num, type) {
        var numSplit, dec, int, type;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = parseInt(numSplit[0]).toLocaleString();
        dec = numSplit[1];
        /* if (int.length > 3 && int.length <= 6) {
             int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 4);
         } else if (int.length > 6) {
             int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, int.length - 4) + ',' + int.substr(int.length - 3, 7);
             console.log(int.length);
         }*/
        /*else if (int.length == 8) {
                   int = int.substr(0, int.length - 6) + ',' + int.substr(int.length - 6, int.length - 5) + ',' + int.substr(int.length - 3, 7);
               }*/

        //10,000,000

        return (type === 'exp' ? '-' : '+') + int + '.' + dec;


    }
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        };
    };


    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, newHtml, element
            if (type === 'inc') {
                element = DOMStrings.incomeContainer
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>'
            } else {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">    <div class="item__value">%value%</div> <div class="item__percentage">bla%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div></div></div>'
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields, fieldsArr
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue)
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            })
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            var type, expercentageLabel;

            obj.budget > 0 ? type = 'inc' : type = 'exp'
            expercentageLabel = document.querySelector(DOMStrings.percentageLabel);
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                if (obj.percentage <= 9999) {

                    expercentageLabel.textContent = obj.percentage + '%'
                } else if (obj.percentage > 9999) {
                    expercentageLabel.textContent = 9999 + '%';
                }


            } else {
                expercentageLabel.textContent = '-'
            }
        },

        displayItemPercentage: function (percent) {
            var fields = document.querySelectorAll(DOMStrings.expensePercLabel);



            nodeListForEach(fields, function (current, index) {

                if (percent[index] > 0) {
                    if (percent[index] < 999) {
                        current.textContent = percent[index] + '%';
                    } else if (percent[index] > 999) {
                        current.textContent = 999 + '%';
                    }
                } else {
                    current.textContent = '-';
                }

            });

        },

        displayMonth: function () {
            var year, month, months;
            year = new Date().getFullYear();
            month = new Date().getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;


        },
        changedType: function () {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' +
                DOMStrings.inputDescription + ',' +
                DOMStrings.inputValue
            );
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            })
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },


        getDOMStrings: function () {
            return DOMStrings
        }
    }
})()

var controller = (function (budgetCtrl, UICtrl) {


    var setEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener('keypress', function (event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();

            }
        })
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);


    }


    var updateBudget = function () {
        //calc the budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //display the budget in the UI
        UICtrl.displayBudget(budget)
    }


    var ctrlAddItem = function () {

        var input, newItem
        //get the field input data
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > -1) {
            //add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //add the item to the ui
            UICtrl.addListItem(newItem, input.type);
            // Clear fields

            UICtrl.clearFields();

        }

        //calculate the budget
        updateBudget();

        //update percentages
        updatePercentages()
    }
    var updatePercentages = function () {
        // calculate percentage
        budgetCtrl.calculatePercentage();

        //read percentage from the budget controller
        var percentage = budgetCtrl.getPercentage()

        //update ui

        UICtrl.displayItemPercentage(percentage)
    }
    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete the item from the data structure

            budgetCtrl.deleteItem(type, ID);

            //delete the item from the ui

            UICtrl.deleteListItem(itemID);

            //update & show the new budget
            updateBudget();

            //update percentages
            updatePercentages();
        }
    }

    return {
        init: function () {
            UICtrl.displayMonth();
            console.log('app has started');
            setEventListeners();
        }
    }


})(budgetController, UIController);
controller.init();