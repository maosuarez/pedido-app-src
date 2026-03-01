package com.pedidos.service;

import com.pedidos.model.Pedido;
import com.pedidos.repository.PedidoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    public List<Pedido> findAll() {
        return repository.findAll();
    }

    public Pedido findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Pedido no encontrado: " + id));
    }

    public Pedido create(Pedido pedido) {
        if (pedido.getEstado() == null) {
            pedido.setEstado("PENDIENTE");
        }
        return repository.save(pedido);
    }

    public Pedido update(Long id, Pedido body) {
        Pedido existing = findById(id);
        if (body.getCliente() != null) existing.setCliente(body.getCliente());
        if (body.getDescripcion() != null) existing.setDescripcion(body.getDescripcion());
        if (body.getCantidad() != null) existing.setCantidad(body.getCantidad());
        if (body.getEstado() != null) existing.setEstado(body.getEstado());
        return repository.save(existing);
    }

    public void delete(Long id) {
        findById(id); // lanza 404 si no existe
        repository.deleteById(id);
    }
}
