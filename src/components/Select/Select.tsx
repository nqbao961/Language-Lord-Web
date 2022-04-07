import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './Select.module.scss';
import { ReactComponent as CheckIcon } from '../../assets/images/check.svg';
import { ReactComponent as ChevronIcon } from '../../assets/images/chevron.svg';
import { ReactComponent as ErrorIcon } from '../../assets/images/error.svg';
import SimpleBar from 'simplebar-react';
import { useClickOutside } from '../../services/hooks';

export interface OptionItem {
  content: JSX.Element | string;
  value: string | number | boolean;
  text?: string | number | boolean;
  selectedContent?: string;
  selectable?: boolean;
  class?: string;
  isGroup?: boolean;
  group?: string;
}

type SelectProps = {
  fixedLabel?: JSX.Element | string;
  defaultLabel?: string;
  topLabel?: string;
  border?: boolean;
  rightIcon?: JSX.Element;
  error?: string;
  disabled?: boolean;
  width?: number;
  maxHeight?: number;
  multipleSelect?: boolean;
  allToggle?: boolean;
  allItem?: boolean;
  searchable?: boolean;
  searchKey?: 'value' | 'content';
  divider?: boolean;
  value?: OptionItem['value'] | OptionItem['value'][];
  optionList: OptionItem[]; // Should be memorized
  additionalOptions?: JSX.Element;
  deselectable?: boolean;
  onSelectValue?: (selectedValues: any[]) => void;
};

export function Select({
  fixedLabel,
  defaultLabel,
  topLabel,
  border = false,
  rightIcon,
  error = '',
  disabled = false,
  width,
  maxHeight = 532,
  multipleSelect = false,
  allToggle = false,
  allItem = false,
  searchable = false,
  searchKey = 'value',
  divider = false,
  value,
  optionList,
  additionalOptions,
  deselectable,
  onSelectValue = () => {},
}: SelectProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedValues, setSelectedValues] = useState<OptionItem['value'][]>(
    value ? (typeof value === 'object' ? [...value] : [value]) : []
  );
  const [selectedContent, setSelectedContent] = useState(() => {
    const selectedOption = optionList.find(option => option.value === value);
    return value
      ? selectedOption?.selectedContent || selectedOption?.content
      : !multipleSelect && allItem
      ? 'All'
      : null;
  });
  const [animationClass, setAnimationClass] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(optionList);
  const [searchValue, setSearchValue] = useState('');

  const selectRef = useRef<any>(null);

  const allItemElement = useMemo(
    () =>
      allItem ? (
        <div
          key="allItem"
          className={`${styles.optionItem} ${
            multipleSelect ? styles.notSelectable : ''
          } ${divider ? styles.divider : ''}`}
          onClick={() => {
            if (!multipleSelect) {
              setSelectedValues([]);
              setSelectedContent(defaultLabel ? '' : 'All');
              onSelectValue([]);
              handleHide();
            }
          }}
        >
          {'All'}
          <div className={styles.checkWrapper}>
            {(selectedValues.length === 0 ||
              selectedValues.length ===
                optionList.filter(option => option.selectable !== false)
                  .length) && (
              <CheckIcon style={{ stroke: 'var(--primary)' }} />
            )}
          </div>
        </div>
      ) : null,
    [selectedValues]
  );

  const handleShow = () => {
    setShowDropdown(true);
    setAnimationClass(styles.showHideAnimation);
  };
  const handleHide = () => {
    setAnimationClass('');
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const renderedOptionList = useMemo(
    () =>
      renderOptionList(
        filteredOptions,
        multipleSelect,
        selectedValues,
        setSelectedValues,
        setSelectedContent,
        divider,
        searchable,
        deselectable,
        setSearchValue,
        handleHide,
        onSelectValue
      ),
    [filteredOptions, selectedValues]
  );

  useEffect(() => {
    setFilteredOptions(optionList);
    if (value) {
      const selectedOption = optionList.find(
        option =>
          option.value === (typeof value === 'object' ? value[0] : value)
      );
      setSelectedValues(typeof value === 'object' ? [...value] : [value]);
      setSelectedContent(
        selectedOption?.selectedContent || selectedOption?.content
      );
      setSearchValue(
        selectedOption?.text?.toString() ||
          selectedOption?.value.toString() ||
          ''
      );
    } else {
      selectedValues.length !== 0 && setSelectedValues([]);
      setSelectedContent(
        !multipleSelect && allItem && !defaultLabel ? 'All' : null
      );
      setSearchValue('');
    }
  }, [optionList, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (deselectable && e.target.value === '') {
      setSelectedValues([]);
      onSelectValue([]);
      setSelectedContent('');
    }
    setSearchValue(e.target.value);
    filterOptions(e.target.value, optionList, setFilteredOptions, searchKey);
  };

  useClickOutside(selectRef, handleHide);

  return (
    <div
      ref={selectRef}
      className={`${styles.selectButton}  ${
        disabled ? styles.disabled : ''
      } selectButton`}
    >
      {topLabel && <div className={styles.topLabel}>{topLabel}</div>}
      <div
        className={`${styles.buttonWrapper} ${border ? styles.border : ''} ${
          error !== '' ? styles.error : ''
        } selectButtonWrapper`}
        onClick={() => {
          if (!disabled) {
            if (showDropdown) {
              handleHide();
            } else {
              handleShow();
            }
          }
        }}
      >
        {fixedLabel && <div className={styles.fixedLabel}>{fixedLabel}</div>}
        {!searchable && defaultLabel && selectedValues.length === 0 && (
          <div className={styles.defaultLabel}>{defaultLabel}</div>
        )}
        {((searchable && !multipleSelect) ||
          (searchable &&
            multipleSelect &&
            (showDropdown || selectedValues.length === 0))) && (
          <input
            className={styles.searchInput}
            placeholder={defaultLabel}
            type="text"
            value={searchValue}
            disabled={disabled}
            onChange={e => handleInputChange(e)}
            onClick={e => {
              if (showDropdown) {
                e.stopPropagation();
              }
            }}
          />
        )}
        {(!searchable || (multipleSelect && !showDropdown)) && (
          <div className={styles.selectedValue}>
            {selectedValues.length > 0 &&
              (!multipleSelect || selectedValues.length === 1 ? (
                selectedContent
              ) : (
                <span className={styles.numSelected}>
                  {`${selectedValues.length} ${'Selected'}`}
                </span>
              ))}
            {selectedValues.length === 0 &&
              !multipleSelect &&
              allItem &&
              selectedContent}
          </div>
        )}
        {rightIcon ? (
          <div className={styles.rightIcon}>{rightIcon}</div>
        ) : (
          <ChevronIcon
            style={{
              stroke: disabled ? 'var(--outline)' : 'var(--primary)',
            }}
            className={`${styles.arrowWrapper} ${
              showDropdown ? styles.arrowUp : ''
            }`}
          />
        )}
      </div>

      {error !== '' && (
        <div className={styles.errorWrapper}>
          <ErrorIcon />
          <span>{error}</span>
        </div>
      )}

      {showDropdown && (
        <div
          className={`${styles.dropdownContainer} selectDropdown ${animationClass}`}
        >
          {allToggle && (
            <div className={styles.allToggle}>
              {selectedValues.length > 0 ? (
                <span
                  onClick={() => {
                    setSelectedValues([]);
                    onSelectValue([]);
                  }}
                >
                  {'Deselect All'}
                </span>
              ) : multipleSelect ? (
                <span
                  onClick={() => {
                    const selectedValues = filteredOptions
                      .filter(option => option.selectable !== false)
                      .map(option => option.value);
                    setSelectedValues(selectedValues);
                    onSelectValue(selectedValues);
                  }}
                >
                  {'Select All'}
                </span>
              ) : (
                <span style={{ visibility: 'hidden' }}>.</span>
              )}
            </div>
          )}
          {!width && (
            <div
              style={{ height: 0, visibility: 'hidden' }}
              className={styles.optionList}
            >
              {renderedOptionList}
            </div>
          )}
          <SimpleBar style={{ maxHeight: maxHeight, width: width || 'auto' }}>
            <div className={styles.optionList}>
              {allItem
                ? [
                    allItemElement,
                    ...renderedOptionList,
                    ...(additionalOptions ? [additionalOptions] : []),
                  ]
                : renderedOptionList}
            </div>
          </SimpleBar>
        </div>
      )}
    </div>
  );
}

function renderOptionList(
  optionList: SelectProps['optionList'],
  multipleSelect: SelectProps['multipleSelect'],
  selectedValues: OptionItem['value'][],
  setSelectedValues: React.Dispatch<any>,
  setSelectedContent: React.Dispatch<any>,
  divider: boolean,
  searchable: SelectProps['searchable'],
  deselectable: boolean | undefined,
  setSearchValue: React.Dispatch<any>,
  handleHide: () => void,
  onSelectValue: (selectedValues: any[]) => void
) {
  return optionList.map((option, index, options) => (
    <div
      key={`option-${index}`}
      className={`${styles.optionItem} ${option.class ? option.class : ''} ${
        option.selectable === false ? styles.notSelectable : ''
      } ${divider ? styles.divider : ''}`}
      onClick={() => {
        if (option.selectable !== false) {
          // Multiple select case
          if (multipleSelect) {
            if (selectedValues.includes(option.value)) {
              // Selected case => uncheck option
              const selected = selectedValues.filter(
                value => value !== option.value
              );
              if (selectedValues.length === 2) {
                const lastOption = options.find(
                  option => option.value === selected[0]
                );
                setSelectedContent(
                  lastOption?.selectedContent || lastOption?.content
                );
              }
              setSelectedValues(selected);
              onSelectValue(selected);
              // If this option is group, uncheck all child options
              if (option.isGroup) {
                const childOptionValues = options
                  .filter(item => item.group === option.value)
                  .map(item => item.value);
                const selectedChildValues = selectedValues.filter(
                  value => ![option.value, ...childOptionValues].includes(value)
                );
                setSelectedValues(selectedChildValues);
                onSelectValue(selectedChildValues);
              }
              if (option.group) {
                const selected = selectedValues.filter(
                  value => value !== option.value && value !== option.group
                );
                setSelectedValues(selected);
                onSelectValue(selected);
              }
            } else {
              // Not selected case => check option
              const values = [...selectedValues, option.value];
              setSelectedValues(values);
              setSelectedContent(option.selectedContent || option.content);
              onSelectValue(values);
              // If this option is group, check all child options
              if (option.isGroup) {
                const childOptionValues = options
                  .filter(item => item.group === option.value)
                  .map(item => item.value);
                const values = [
                  ...selectedValues,
                  option.value,
                  ...childOptionValues.filter(
                    item => !selectedValues.includes(item)
                  ),
                ];
                setSelectedValues(values);
                onSelectValue(values);
              }
            }
          }
          // Single select case
          else {
            if (!option.isGroup) {
              if (deselectable && selectedValues.includes(option.value)) {
                setSelectedValues([]);
                onSelectValue([]);
                if (searchable && !multipleSelect) {
                  setSearchValue('');
                }
                setSelectedContent('');
              } else {
                setSelectedValues([option.value]);
                onSelectValue([option.value]);
                if (searchable && !multipleSelect) {
                  setSearchValue(option.text || option.value);
                }
                setSelectedContent(option.selectedContent || option.content);
              }
              handleHide();
            }
          }
        }
      }}
    >
      {option.content}
      {option.selectable !== false && (
        <div className={styles.checkWrapper}>
          {multipleSelect ? (
            <div
              className={`${styles.checkbox} ${
                selectedValues.includes(option.value) ? styles.checked : ''
              }`}
            >
              <CheckIcon
                className={styles.checkIcon}
                style={{ stroke: ' var(--background)' }}
              />
            </div>
          ) : (
            selectedValues.includes(option.value) && (
              <CheckIcon style={{ stroke: 'var(--primary)' }} />
            )
          )}
        </div>
      )}
    </div>
  ));
}

function filterOptions(
  searchValue: string,
  optionList: OptionItem[],
  setFilteredOptions: React.Dispatch<any>,
  searchKey: SelectProps['searchKey']
) {
  const matchData = optionList.filter(option => {
    const optionText = option.text || option[searchKey || 'value'];
    return optionText
      .toString()
      .toLowerCase()
      .includes(searchValue.trim().toLowerCase());
  });

  const filteredOptions = matchData.reduce((pre, cur) => {
    let childOptions = [] as OptionItem[];
    if (cur.isGroup) {
      childOptions = optionList.filter(
        option =>
          option.group === cur.value &&
          !matchData.map(item => item.value).includes(option.value)
      );
    }
    return [...pre, ...[cur], ...childOptions];
  }, [] as OptionItem[]);

  setFilteredOptions(filteredOptions);
}
