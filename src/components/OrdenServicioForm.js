import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { Slider } from "primereact/slider";
import { Knob } from "primereact/knob";
import { Rating } from "primereact/rating";
import { ColorPicker } from "primereact/colorpicker";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { InputSwitch } from "primereact/inputswitch";
import { ListBox } from "primereact/listbox";
import { Dropdown } from "primereact/dropdown";
import { ToggleButton } from "primereact/togglebutton";
import { MultiSelect } from "primereact/multiselect";
import { TreeSelect } from "primereact/treeselect";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { CountryService } from "../service/CountryService";
import { NodeService } from "../service/NodeService";

export const OrdenServicioForm = () => {
    const [floatValue, setFloatValue] = useState("");
    const [autoValue, setAutoValue] = useState(null);
    const [selectedAutoValue, setSelectedAutoValue] = useState(null);
    const [autoFilteredValue, setAutoFilteredValue] = useState([]);
    const [calendarValue, setCalendarValue] = useState(null);
    const [inputNumberValue, setInputNumberValue] = useState(null);
    const [chipsValue, setChipsValue] = useState([]);
    const [sliderValue, setSliderValue] = useState("");
    const [ratingValue, setRatingValue] = useState(null);
    const [colorValue, setColorValue] = useState("1976D2");
    const [knobValue, setKnobValue] = useState(20);
    const [radioValue, setRadioValue] = useState(null);
    const [checkboxValue, setCheckboxValue] = useState([]);
    const [switchValue, setSwitchValue] = useState(false);
    const [listboxValue, setListboxValue] = useState(null);
    const [dropdownValue, setDropdownValue] = useState(null);
    const [multiselectValue, setMultiselectValue] = useState(null);
    const [toggleValue, setToggleValue] = useState(false);
    const [selectButtonValue1, setSelectButtonValue1] = useState(null);
    const [selectButtonValue2, setSelectButtonValue2] = useState(null);
    const [inputGroupValue, setInputGroupValue] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeSelectNodes, setTreeSelectNodes] = useState(null);

    const listboxValues = [
        { name: "New York", code: "NY" },
        { name: "Rome", code: "RM" },
        { name: "London", code: "LDN" },
        { name: "Istanbul", code: "IST" },
        { name: "Paris", code: "PRS" },
    ];

    const dropdownValues = [
        { name: "New York", code: "NY" },
        { name: "Rome", code: "RM" },
        { name: "London", code: "LDN" },
        { name: "Istanbul", code: "IST" },
        { name: "Paris", code: "PRS" },
    ];

    const multiselectValues = [
        { name: "Australia", code: "AU" },
        { name: "Brazil", code: "BR" },
        { name: "China", code: "CN" },
        { name: "Egypt", code: "EG" },
        { name: "France", code: "FR" },
        { name: "Germany", code: "DE" },
        { name: "India", code: "IN" },
        { name: "Japan", code: "JP" },
        { name: "Spain", code: "ES" },
        { name: "United States", code: "US" },
    ];

    const selectButtonValues1 = [
        { name: "Option 1", code: "O1" },
        { name: "Option 2", code: "O2" },
        { name: "Option 3", code: "O3" },
    ];

    const selectButtonValues2 = [
        { name: "Option 1", code: "O1" },
        { name: "Option 2", code: "O2" },
        { name: "Option 3", code: "O3" },
    ];

    useEffect(() => {
        const countryService = new CountryService();
        const nodeService = new NodeService();
        countryService.getCountries().then((data) => setAutoValue(data));
        nodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
    }, []);

    const searchCountry = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                setAutoFilteredValue([...autoValue]);
            } else {
                setAutoFilteredValue(
                    autoValue.filter((country) => {
                        return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                    })
                );
            }
        }, 250);
    };

    const onCheckboxChange = (e) => {
        let selectedValue = [...checkboxValue];
        if (e.checked) selectedValue.push(e.value);
        else selectedValue.splice(selectedValue.indexOf(e.value), 1);

        setCheckboxValue(selectedValue);
    };

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: "18px", height: "12px" }} />
                <span>{option.name}</span>
            </div>
        );
    };

    const selectedItemTemplate = (option) => {
        if (option) {
            return (
                <div className="inline-flex align-items-center py-1 px-2 bg-primary text-primary border-round mr-2">
                    <span className={`mr-2 flag flag-${option.code.toLowerCase()}`} style={{ width: "18px", height: "12px" }} />
                    <span>{option.name}</span>
                </div>
            );
        }

        return "Select Countries";
    };

    return (
        <div className="grid p-fluid">
            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Cliente</h5>
                    <AutoComplete placeholder="Ingresa la cedula" id="dd" dropdown value={selectedAutoValue} onChange={(e) => setSelectedAutoValue(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />

                    <h5>Tecnico</h5>
                    <AutoComplete placeholder="Ingresa la cedula" id="dd" dropdown value={selectedAutoValue} onChange={(e) => setSelectedAutoValue(e.value)} suggestions={autoFilteredValue} completeMethod={searchCountry} field="name" />
                    <h5>Estado</h5>
                    <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />
                    <h5>Precio</h5>
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <span className="p-float-label">
                                    <InputText placeholder="Sub total sin IVA" />
                                    <span className="p-inputgroup-addon">$</span>
                                </span>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <InputText placeholder="Valor IVA" />
                                <span className="p-inputgroup-addon">%</span>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <InputText placeholder="Sub total sin IVA" />
                                <span className="p-inputgroup-addon">$</span>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <InputText placeholder="Descuento" />
                                <span className="p-inputgroup-addon">%</span>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                                <InputText placeholder="Total" disabled />
                                <span className="p-inputgroup-addon">$</span>
                            </div>
                        </div>
                    </div>

                    <h5>Observaciones</h5>
                    <InputTextarea placeholder="Observacion..." autoResize rows="3" cols="30" />

                    <h5>Fecha de emision</h5>
                    <Calendar showIcon showButtonBar value={calendarValue} onChange={(e) => setCalendarValue(e.value)}></Calendar>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card">
                    <h5>Diagnostico en recepción</h5>
                    <InputTextarea placeholder="Decripcion del cliente..." autoResize rows="3" cols="30" />
                    <h5>Diagnostico del tecnico</h5>
                    <InputTextarea placeholder="Observaciones..." autoResize rows="3" cols="30" />
                    <h5>Descripcion del diagnostico tecnico</h5>
                    <InputTextarea placeholder="Descripcion..." autoResize rows="3" cols="30" />

                      <h5>Producto</h5>
                <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="Select" />

                </div>
            </div>
      <div className="col-12">
                <div className="card">
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="p-inputgroup">
                          <Button label="Submit" className="mr-2 mb-2"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(OrdenServicioForm, comparisonFn);
