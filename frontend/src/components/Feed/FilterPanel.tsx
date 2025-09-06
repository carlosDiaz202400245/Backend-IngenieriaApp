import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { FilterType } from '../../types';

interface FilterPanelProps {
  filterType: FilterType;
  filterValue: string;
  onFilterTypeChange: (type: FilterType) => void;
  onFilterValueChange: (value: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  filterType,
  filterValue,
  onFilterTypeChange,
  onFilterValueChange,
  onClearFilters
}: FilterPanelProps) {
  const filterOptions = [
    { value: 'none', label: 'Sin filtro' },
    { value: 'course', label: 'Filtrar por Curso' },
    { value: 'professor', label: 'Filtrar por Catedrático' },
    { value: 'courseName', label: 'Buscar por Nombre de Curso' },
    { value: 'professorName', label: 'Buscar por Nombre de Catedrático' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium text-gray-900">Filtros de Búsqueda</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de filtro
          </label>
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => onFilterTypeChange(e.target.value as FilterType)}
              className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="h-5 w-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {filterType !== 'none' && (filterType === 'courseName' || filterType === 'professorName') && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {filterType === 'courseName' ? 'Nombre del curso' : 'Nombre del catedrático'}
            </label>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => onFilterValueChange(e.target.value)}
              placeholder={filterType === 'courseName' ? 'Ej: Programación' : 'Ej: Dr. Pérez'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {filterType !== 'none' && (
          <div className="flex items-end">
            <button
              onClick={onClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}