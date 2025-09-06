// app/components/editor/blocks/PricingBlock.tsx
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';

interface PricePlan {
  name: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
}

export interface PricingData {
  variant: 'columns' | 'list' | 'simple';
  title: string;
  subtitle: string;
  plans: PricePlan[];
  backgroundColor: string;
  highlightColor: string;
}

export function PricingBlock({ data }: { data: PricingData }) {
  switch (data.variant) {
    case 'list': return <PricingList data={data} />;
    case 'simple': return <PricingSimple data={data} />;
    default: return <PricingColumns data={data} />;
  }
}

const PricingColumns = ({ data }: { data: PricingData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-white'}`,
      {
        'py-16 px-8': isDesktop,
        'py-12 px-6': isTablet,
        'py-8 px-4': isMobile,
      }
    )}>
      <div className={cn(
        "mx-auto text-center",
        {
          'max-w-6xl': isDesktop,
          'max-w-4xl': isTablet,
          'max-w-full': isMobile,
        }
      )}>
        <h2 className={cn(
          "font-bold text-slate-800 mb-4",
          {
            'text-4xl': isDesktop,
            'text-3xl': isTablet,
            'text-2xl': isMobile,
          }
        )}>
          {data.title}
        </h2>
        
        <p className={cn(
          "text-slate-600 mx-auto mb-12",
          {
            'text-xl max-w-3xl': isDesktop,
            'text-lg max-w-2xl': isTablet,
            'text-base max-w-full': isMobile,
          }
        )}>
          {data.subtitle}
        </p>
        
        <div className={cn(
          "gap-8",
          {
            'grid md:grid-cols-3': isDesktop,
            'grid sm:grid-cols-2 lg:grid-cols-3': isTablet,
            'flex flex-col space-y-6': isMobile,
          }
        )}>
          {(data.plans || []).map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                `border rounded-lg text-left flex flex-col ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}`,
                {
                  'p-8': isDesktop,
                  
                  'p-6': isMobile,
                }
              )}
            >
              <h3 className={cn(
                "font-semibold mb-2",
                {
                  'text-2xl': isDesktop,
                  'text-xl': isTablet,
                  'text-lg': isMobile,
                }
              )}>
                {plan.name}
              </h3>
              
              <p className={cn(
                "text-slate-500 mb-6",
                {
                  'text-base': isDesktop,
                 
                  'text-sm': isMobile,
                }
              )}>
                {plan.description}
              </p>
              
              <p className={cn(
                "font-bold mb-6",
                {
                  'text-5xl': isDesktop,
                  'text-4xl': isTablet,
                  'text-3xl': isMobile,
                }
              )}>
                ${plan.price}
                <span className={cn(
                  "font-normal text-slate-500",
                  {
                    'text-lg': isDesktop,
                    'text-base': isTablet,
                    'text-sm': isMobile,
                  }
                )}>
                  {plan.frequency}
                </span>
              </p>
              
              <ul className={cn(
                "text-slate-600 space-y-3 my-6 flex-grow",
                {
                  'text-base': isDesktop,
                 
                  'text-sm': isMobile,
                }
              )}>
                {(plan.features || []).map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-3">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="#" 
                className={cn(
                  `w-full text-center rounded-md font-semibold transition-colors ${plan.highlighted ? `${data.highlightColor ? data.highlightColor.replace('border-', 'bg-') : 'bg-blue-600'} text-white hover:opacity-90` : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`,
                  {
                    'py-3 text-lg': isDesktop,
                    'py-2.5 text-base': isTablet,
                    'py-2 text-sm': isMobile,
                  }
                )}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingList = ({ data }: { data: PricingData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-white'}`,
      {
        'py-16 px-8': isDesktop,
        'py-12 px-6': isTablet,
        'py-8 px-4': isMobile,
      }
    )}>
      <div className={cn(
        "mx-auto",
        {
          'max-w-5xl': isDesktop,
          'max-w-4xl': isTablet,
          'max-w-full': isMobile,
        }
      )}>
        <div className={cn(
          "text-center",
          {
            'mb-16': isDesktop,
            'mb-12': isTablet,
            'mb-8': isMobile,
          }
        )}>
          <h2 className={cn(
            "font-bold text-slate-800 mb-4",
            {
              'text-4xl': isDesktop,
              'text-3xl': isTablet,
              'text-2xl': isMobile,
            }
          )}>
            {data.title}
          </h2>
          
          <p className={cn(
            "text-slate-600",
            {
              'text-xl': isDesktop,
              'text-lg': isTablet,
              'text-base': isMobile,
            }
          )}>
            {data.subtitle}
          </p>
        </div>
        
        <div className={cn(
          {
            'space-y-6': isDesktop || isTablet,
            'space-y-4': isMobile,
          }
        )}>
          {(data.plans || []).map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                `border rounded-lg items-center gap-6 ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}`,
                {
                  'p-6 grid md:grid-cols-3': isDesktop || isTablet,
                  'p-4 flex flex-col text-center space-y-4': isMobile,
                }
              )}
            >
              <div className={cn(
                {
                  'md:col-span-2': isDesktop || isTablet,
                  '': isMobile,
                }
              )}>
                <h3 className={cn(
                  "font-semibold mb-2",
                  {
                    'text-2xl': isDesktop,
                    'text-xl': isTablet,
                    'text-lg': isMobile,
                  }
                )}>
                  {plan.name}
                </h3>
                
                <p className={cn(
                  "text-slate-500",
                  {
                    'text-base': isDesktop,
                   
                    'text-sm': isMobile,
                  }
                )}>
                  {plan.description}
                </p>
              </div>
              
              <div className={cn(
                {
                  'text-right': isDesktop || isTablet,
                  'text-center': isMobile,
                }
              )}>
                <p className={cn(
                  "font-bold",
                  {
                    'text-4xl': isDesktop,
                    'text-3xl': isTablet,
                    'text-2xl': isMobile,
                  }
                )}>
                  ${plan.price}
                  <span className={cn(
                    "font-normal text-slate-500",
                    {
                      'text-lg': isDesktop,
                      'text-base': isTablet,
                      'text-sm': isMobile,
                    }
                  )}>
                    {plan.frequency}
                  </span>
                </p>
                
                <a 
                  href="#" 
                  className={cn(
                    "inline-block text-center rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors",
                    {
                      'mt-4 w-full py-3 text-base': isDesktop || isTablet,
                      'mt-3 w-full py-2 text-sm': isMobile,
                    }
                  )}
                >
                  {plan.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PricingSimple = ({ data }: { data: PricingData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-white'}`,
      {
        'py-16 px-8': isDesktop,
        'py-12 px-6': isTablet,
        'py-8 px-4': isMobile,
      }
    )}>
      <div className={cn(
        "mx-auto",
        {
          'max-w-5xl': isDesktop,
          'max-w-4xl': isTablet,
          'max-w-full': isMobile,
        }
      )}>
        <div className={cn(
          "text-center",
          {
            'mb-16': isDesktop,
            'mb-12': isTablet,
            'mb-8': isMobile,
          }
        )}>
          <h2 className={cn(
            "font-bold text-slate-800 mb-4",
            {
              'text-4xl': isDesktop,
              'text-3xl': isTablet,
              'text-2xl': isMobile,
            }
          )}>
            {data.title}
          </h2>
          
          <p className={cn(
            "text-slate-600",
            {
              'text-xl': isDesktop,
              'text-lg': isTablet,
              'text-base': isMobile,
            }
          )}>
            {data.subtitle}
          </p>
        </div>
        
        <div className={cn(
          "gap-8",
          {
            'grid md:grid-cols-2': isDesktop || isTablet,
            'flex flex-col space-y-6': isMobile,
          }
        )}>
          {(data.plans || []).map((plan, i) => (
            <div 
              key={i} 
              className={cn(
                `border rounded-lg ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}`,
                {
                  'p-8': isDesktop,
                 
                  'p-6': isMobile,
                }
              )}
            >
              <h3 className={cn(
                "font-semibold mb-4",
                {
                  'text-2xl': isDesktop,
                  'text-xl': isTablet,
                  'text-lg': isMobile,
                }
              )}>
                {plan.name}
              </h3>
              
              <p className={cn(
                "font-bold mb-6",
                {
                  'text-5xl': isDesktop,
                  'text-4xl': isTablet,
                  'text-3xl': isMobile,
                }
              )}>
                ${plan.price}
                <span className={cn(
                  "font-normal text-slate-500",
                  {
                    'text-lg': isDesktop,
                    'text-base': isTablet,
                    'text-sm': isMobile,
                  }
                )}>
                  {plan.frequency}
                </span>
              </p>
              
              <p className={cn(
                "text-slate-500 mb-6",
                {
                  'text-base': isDesktop,
                  
                  'text-sm': isMobile,
                }
              )}>
                {plan.description}
              </p>
              
              <a 
                href="#" 
                className={cn(
                  "w-full block text-center rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors",
                  {
                    'py-3 text-lg': isDesktop,
                    'py-2.5 text-base': isTablet,
                    'py-2 text-sm': isMobile,
                  }
                )}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function PricingEditor({ data, updateData }: { data: PricingData, updateData: (key: keyof PricingData, value: string | PricePlan[]) => void }) {

    const updatePlanData = (planIndex: number, key: keyof PricePlan, value: string | boolean | string[]) => {
        const newPlans = [...(data.plans || [])];

        if (key === 'highlighted' && typeof value === 'boolean') {
            newPlans.forEach((p, i) => {
                p.highlighted = i === planIndex ? value : false;
            });
        } else {
            const planToUpdate = { ...newPlans[planIndex], [key]: value };
            newPlans[planIndex] = planToUpdate;
        }

        updateData('plans', newPlans);
    };

    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-medium text-sm text-slate-600">Contenido Principal</h4>
                <InputField label="Título" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
                <TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
            </div>
            
            {(data.plans || []).map((plan, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm text-slate-700">Plan {index + 1}</h4>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={plan.highlighted} onChange={(e) => updatePlanData(index, 'highlighted', e.target.checked)} />
                            Destacar
                        </label>
                    </div>
                    <InputField label="Nombre del Plan" value={plan.name} onChange={e => updatePlanData(index, 'name', e.target.value)} />
                    <div className="flex gap-2">
                        <InputField label="Precio" value={plan.price} onChange={e => updatePlanData(index, 'price', e.target.value)} />
                        <InputField label="Frecuencia" value={plan.frequency} onChange={e => updatePlanData(index, 'frequency', e.target.value)} />
                    </div>
                    <TextareaField label="Descripción" value={plan.description} rows={2} onChange={e => updatePlanData(index, 'description', e.target.value)} />
                    <TextareaField label="Características (una por línea)" value={(plan.features || []).join('\n')} rows={4} onChange={e => updatePlanData(index, 'features', e.target.value.split('\n'))} />
                    <InputField label="Texto del Botón" value={plan.buttonText} onChange={e => updatePlanData(index, 'buttonText', e.target.value)} />
                </div>
            ))}

            <div className="border-t border-slate-200 pt-4 space-y-4">
                <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
                <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
            </div>
        </div>
    );
}