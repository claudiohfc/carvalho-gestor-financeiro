import { useState } from 'react';
import { Users, Briefcase, UserCheck, Plus, Pencil, Trash2 } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  partners as initialPartners,
  employees as initialEmployees,
  contractors as initialContractors,
  getTotalPartnerCosts,
  getTotalEmployeeCosts,
  getTotalContractorCosts,
  getPartnerTotal,
  getEmployeeTotal,
  getContractorTotal,
  formatCurrency,
  type Partner,
  type Employee,
  type Contractor,
} from '@/data/mockPeopleData';
import { cn } from '@/lib/utils';

export default function DepartamentoPessoal() {
  const [partners] = useState(initialPartners);
  const [employees] = useState(initialEmployees);
  const [contractors] = useState(initialContractors);
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('2026');

  return (
    <MainLayout>
      <Header
        title="Departamento Pessoal"
        subtitle="Gestão de pessoas e custos com pessoal"
      />
      <div className="p-6 space-y-6">
        {/* Filtros */}
        <div className="flex gap-3">
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="01">Janeiro</SelectItem>
              <SelectItem value="02">Fevereiro</SelectItem>
              <SelectItem value="03">Março</SelectItem>
              <SelectItem value="04">Abril</SelectItem>
              <SelectItem value="05">Maio</SelectItem>
              <SelectItem value="06">Junho</SelectItem>
              <SelectItem value="07">Julho</SelectItem>
              <SelectItem value="08">Agosto</SelectItem>
              <SelectItem value="09">Setembro</SelectItem>
              <SelectItem value="10">Outubro</SelectItem>
              <SelectItem value="11">Novembro</SelectItem>
              <SelectItem value="12">Dezembro</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="border-border bg-card hover:border-primary/30 transition-all">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Gastos com Sócios</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{formatCurrency(getTotalPartnerCosts())}</p>
                  <p className="text-[11px] text-muted-foreground">{partners.length} sócios ativos</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card hover:border-success/30 transition-all">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Gastos com Funcionários</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{formatCurrency(getTotalEmployeeCosts())}</p>
                  <p className="text-[11px] text-muted-foreground">{employees.length} funcionários ativos</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                  <Briefcase className="h-4 w-4 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card hover:border-warning/30 transition-all">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Gastos com Terceiros</p>
                  <p className="mt-1 text-xl font-bold text-foreground">{formatCurrency(getTotalContractorCosts())}</p>
                  <p className="text-[11px] text-muted-foreground">{contractors.length} terceiros ativos</p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                  <UserCheck className="h-4 w-4 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sócios */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Cadastro de Sócios</CardTitle>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Plus className="h-3 w-3" /> Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Nome</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">CPF</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Telefone</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Início</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map(p => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-medium text-foreground">{p.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{p.cpf}</td>
                        <td className="py-2 px-2 text-muted-foreground">{p.email}</td>
                        <td className="py-2 px-2 text-muted-foreground">{p.phone}</td>
                        <td className="py-2 px-2 text-muted-foreground">{p.startDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quadro Financeiro - Sócios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Nome</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Pró-labore</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Comissões</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Reembolsos</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map(p => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-medium text-foreground">{p.name}</td>
                        <td className="py-2 px-2 text-right text-foreground">{formatCurrency(p.prolabore)}</td>
                        <td className="py-2 px-2 text-right text-foreground">{formatCurrency(p.comissoes)}</td>
                        <td className="py-2 px-2 text-right text-foreground">{formatCurrency(p.reembolsos)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-foreground">{formatCurrency(getPartnerTotal(p))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30">
                      <td className="py-2 px-2 font-bold text-foreground">Total</td>
                      <td className="py-2 px-2 text-right font-bold text-foreground">{formatCurrency(partners.reduce((s, p) => s + p.prolabore, 0))}</td>
                      <td className="py-2 px-2 text-right font-bold text-foreground">{formatCurrency(partners.reduce((s, p) => s + p.comissoes, 0))}</td>
                      <td className="py-2 px-2 text-right font-bold text-foreground">{formatCurrency(partners.reduce((s, p) => s + p.reembolsos, 0))}</td>
                      <td className="py-2 px-2 text-right font-bold text-foreground">{formatCurrency(getTotalPartnerCosts())}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funcionários */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Cadastro de Funcionários</CardTitle>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Plus className="h-3 w-3" /> Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Nome</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">CPF</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Telefone</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Início</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(e => (
                      <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-medium text-foreground">{e.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{e.cpf}</td>
                        <td className="py-2 px-2 text-muted-foreground">{e.email}</td>
                        <td className="py-2 px-2 text-muted-foreground">{e.phone}</td>
                        <td className="py-2 px-2 text-muted-foreground">{e.startDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quadro Financeiro - Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-1 font-medium text-muted-foreground">Nome</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">Salário</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">VT</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">VA</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">Benef.</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">FGTS</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">INSS</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">IR</th>
                      <th className="text-right py-2 px-1 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(e => (
                      <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-1 font-medium text-foreground">{e.name}</td>
                        <td className="py-2 px-1 text-right text-foreground">{formatCurrency(e.salario)}</td>
                        <td className="py-2 px-1 text-right text-muted-foreground">{formatCurrency(e.vt)}</td>
                        <td className="py-2 px-1 text-right text-muted-foreground">{formatCurrency(e.va)}</td>
                        <td className="py-2 px-1 text-right text-muted-foreground">{formatCurrency(e.beneficios)}</td>
                        <td className="py-2 px-1 text-right text-muted-foreground">{formatCurrency(e.fgts)}</td>
                        <td className="py-2 px-1 text-right text-muted-foreground">{formatCurrency(e.inss)}</td>
                        <td className="py-2 px-1 text-right text-muted-foreground">{formatCurrency(e.ir)}</td>
                        <td className="py-2 px-1 text-right font-semibold text-foreground">{formatCurrency(getEmployeeTotal(e))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30">
                      <td className="py-2 px-1 font-bold text-foreground">Total</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(employees.reduce((s, e) => s + e.salario, 0))}</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(employees.reduce((s, e) => s + e.vt, 0))}</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(employees.reduce((s, e) => s + e.va, 0))}</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(employees.reduce((s, e) => s + e.beneficios, 0))}</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(employees.reduce((s, e) => s + e.fgts, 0))}</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(employees.reduce((s, e) => s + e.inss, 0))}</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(employees.reduce((s, e) => s + e.ir, 0))}</td>
                      <td className="py-2 px-1 text-right font-bold">{formatCurrency(getTotalEmployeeCosts())}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terceiros */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Cadastro de Colaboradores e Terceiros</CardTitle>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Plus className="h-3 w-3" /> Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Nome</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">CPF</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Telefone</th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Início</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractors.map(c => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-medium text-foreground">{c.name}</td>
                        <td className="py-2 px-2 text-muted-foreground">{c.cpf}</td>
                        <td className="py-2 px-2 text-muted-foreground">{c.email}</td>
                        <td className="py-2 px-2 text-muted-foreground">{c.phone}</td>
                        <td className="py-2 px-2 text-muted-foreground">{c.startDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quadro Financeiro - Colaboradores e Terceiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Nome</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Retiradas</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Comissões</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractors.map(c => (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-2 px-2 font-medium text-foreground">{c.name}</td>
                        <td className="py-2 px-2 text-right text-foreground">{formatCurrency(c.retiradas)}</td>
                        <td className="py-2 px-2 text-right text-foreground">{formatCurrency(c.comissoes)}</td>
                        <td className="py-2 px-2 text-right font-semibold text-foreground">{formatCurrency(getContractorTotal(c))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/30">
                      <td className="py-2 px-2 font-bold text-foreground">Total</td>
                      <td className="py-2 px-2 text-right font-bold text-foreground">{formatCurrency(contractors.reduce((s, c) => s + c.retiradas, 0))}</td>
                      <td className="py-2 px-2 text-right font-bold text-foreground">{formatCurrency(contractors.reduce((s, c) => s + c.comissoes, 0))}</td>
                      <td className="py-2 px-2 text-right font-bold text-foreground">{formatCurrency(getTotalContractorCosts())}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
