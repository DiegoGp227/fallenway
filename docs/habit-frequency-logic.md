# Lógica de frecuencia de hábitos

Cómo decide la app qué hábitos le tocan al usuario en un día dado.

---

## Filtros universales (aplican a todos los tipos)

Antes de evaluar la frecuencia, dos condiciones eliminan el hábito directamente:

- Está archivado → nunca aparece
- La fecha consultada es anterior a `createdAt` → el hábito no existía ese día

Esto es crítico para la grilla de contribuciones: si un hábito se creó hace 2 meses,
los meses anteriores ese hábito no suma ni como completado ni como pendiente.

---

## DAILY

Aparece todos los días sin excepción. No hay nada que calcular.

---

## SPECIFIC_DAYS

El hábito tiene una lista de días de la semana guardada en `weekDays[]`.
Solo aparece si el día de hoy está en esa lista.

- Hábito con `weekDays = [1, 3, 5]` → lunes, miércoles, viernes
- Si hoy es martes → no aparece
- Si hoy es miércoles → aparece

---

## EVERY_N_DAYS

Se repite cada N días exactos desde su fecha de creación, como un metrónomo.

Para saber si aplica hoy: calculas cuántos días han pasado desde `createdAt`
y verificas si ese número es divisible por N exactamente.

**Ejemplo — "cada 3 días", creado un lunes:**
```
Lunes     → 0 días desde creación → 0 ÷ 3 exacto  ✓
Martes    → 1 día  → no exacto  ✗
Miércoles → 2 días → no exacto  ✗
Jueves    → 3 días → 3 ÷ 3 exacto  ✓
Viernes   → 4 días → no exacto  ✗
```

No importa el día de la semana — solo la distancia desde el origen.

---

## TIMES_PER_WEEK

El único tipo que rompe el patrón de los anteriores.

**Los tres tipos anteriores son deterministas** — con solo saber la fecha puedes
decidir si el hábito aplica. `TIMES_PER_WEEK` no: necesitas saber qué pasó
esta semana para decidir si aparece hoy.

### Lógica

El hábito aparece todos los días de la semana hasta que el usuario lo complete
el número de veces acordado. Cuando alcanza el target, desaparece por el resto
de la semana.

### Ejemplo — "Ir al gimnasio", target 3 veces

**Caso A — distribuido normalmente:**
```
Lunes    → completadas: 0 → falta → aparece. No va.
Martes   → completadas: 0 → falta → aparece. No va.
Miércoles → completadas: 0 → falta → aparece. Va → lleva 1.
Jueves   → completadas: 1 → falta → aparece. Va → lleva 2.
Viernes  → completadas: 2 → falta → aparece. Va → lleva 3.
Sábado   → completadas: 3 = target → desaparece.
Domingo  → sigue oculto.
```

**Caso B — lo dejó para el final:**
```
Lunes a viernes → no va. Lleva 0.
Sábado  → completadas: 0 → aparece. Va → lleva 1.
Domingo → completadas: 1 → aparece. Va → lleva 2.
Fin de semana con 2/3. No llegó al target.
```

La app le dio la oportunidad hasta el último día, pero no hubo penalización
adicional — simplemente no completó la semana.

### Consecuencias importantes

**No tiene un día correcto** — el usuario tiene libertad total de hacerlo
cuando quiera dentro de la semana.

**Puede desaparecer a mitad del día** — si completa el último pendiente el
jueves a las 3pm, el hábito desaparece en ese momento. Los demás tipos
nunca cambian de estado dentro del mismo día.

**Necesita los logs de la semana para evaluarse** — a diferencia de los otros
tipos, no puedes pre-calcular si aparecerá el viernes sin saber qué pasó
el lunes al jueves.

---

## Comparación de tipos

| Tipo              | ¿Determinista? | ¿Qué necesita para evaluarse?         | ¿Puede cambiar dentro del día? |
|-------------------|----------------|---------------------------------------|-------------------------------|
| `DAILY`           | Sí             | Solo la fecha                         | No                            |
| `SPECIFIC_DAYS`   | Sí             | La fecha + `weekDays[]`               | No                            |
| `EVERY_N_DAYS`    | Sí             | La fecha + `createdAt` + `intervalDays` | No                          |
| `TIMES_PER_WEEK`  | No             | La fecha + logs completados esta semana | Sí                          |

---

## Relación con `daily_summary`

`TIMES_PER_WEEK` no encaja bien en el modelo de `daily_summary` por día porque
no tiene un "total" fijo por día — el hábito puede o no aplicar dependiendo
del comportamiento de la semana.

La solución más simple: tratarlo como binario en la grilla de contribuciones.
- Si hubo log ese día → cuenta como completado
- No penaliza días donde no apareció porque ya se había cumplido el target

Ver `contribution-grid.md` para más detalle.
