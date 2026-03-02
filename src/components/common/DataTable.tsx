import React from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { Button } from './Button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAdd?: () => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  title?: string;
  addButtonLabel?: string;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onAdd,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  title,
  addButtonLabel = 'Add New',
  emptyMessage = 'No data available',
  keyExtractor,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const safeData = Array.isArray(data) ? data : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-zlearn-lg border border-surface-borderLight shadow-zlearn overflow-hidden">
        <div className="p-6">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 flex-1 bg-surface-muted rounded-lg animate-skeleton" />
            ))}
          </div>
        </div>
        <div className="border-t border-surface-border">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-14 border-b border-surface-borderLight flex items-center px-6">
              <div className="h-4 w-48 bg-surface-muted rounded animate-skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-zlearn-lg border border-surface-borderLight shadow-zlearn overflow-hidden">
      {(title || onAdd || searchable) && (
        <div className="px-6 py-4 border-b border-surface-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {title && (
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            )}
            <div className="flex items-center gap-3">
              {searchable && (
                <div className="relative flex-1 sm:flex-initial sm:w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-surface-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-zlearn-primary/20 focus:border-zlearn-primary"
                  />
                </div>
              )}
              {onAdd && (
                <Button onClick={onAdd} size="sm">
                  <Plus className="w-4 h-4" />
                  {addButtonLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-borderLight">
            {safeData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-6 py-16 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              safeData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-surface-muted/30 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-gray-500 hover:text-zlearn-primary hover:bg-zlearn-primaryMuted rounded-lg transition-colors duration-150"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
